import React, { useState, useMemo } from 'react'
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Filter from './components/filter'
import { LatLng } from './map/utils'
import vroom from './map/services/vroom2'
import collect from 'collect.js';
import { drivers } from './constants'
import groupBy2 from './utils/groupby2';


export default function StateProvider(props) {

    const [store, dispatch] = useStore(dataStore);

    const [selectedMarkerId, setSelectedMarkerId] = useState();
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [mapEditMode, setMapEditMode] = useState({ on: true, id: null, tool: null });
    const [quickChange, setQuickChange] = useState();
    const [filter, setFilter] = useState('');
    const [groupBy, setGroupBy] = useState('PostalCode,City');
    // const [suburb, setSuburb] = useState('');
    const [paths, setPaths] = useState(new Map());
    const [working, setWorking] = useState(false);
    const [solutions, setSolutions] = useState(new Map());
    const [currentSolutionId, setCurrentSolutionId] = useState();
    const [sidebarContent, setSidebarContent] = useState('drivers');

    const items = collect([...store.values()]).sortBy(groupBy.split(',')[0]);

    console.log(solutions)


    const filteredItems = useMemo(() => collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes'])), [items]);
    const isFiltered = Boolean(filter && filteredItems.count())

    const activeItems = useMemo(
        () => selectedDrivers.length ? items.whereIn('Driver', selectedDrivers) : items,
        [items, selectedDrivers]
    );

    let activePaths = [...paths.entries()].map(([driver, path]) => ({ driver, path }));
    if (selectedDrivers.length) {
        // activeItems = useMemo(() => items.whereIn('Driver', selectedDrivers), [items, selectedDrivers]);
        activePaths = selectedDrivers.map(driver => ({ driver, path: paths.get(driver) || '' }));
    }

    // const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
    const selectedItem = store.get(selectedMarkerId);


    function groupItems({ items, by }) {
        return groupBy2(items, by);
    }

    async function autoAssign() {
        const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
        if (!activeItems.count()) return;
        setWorking(true);
        setMapEditMode({ on: false, id: null, tool: null });
        const snapshotId = Date.now();
        dispatch({ type: 'add-snapshot', id: snapshotId });
        const { paths: newPaths, newItems, solution } = await vroom(activeItems.all(), _drivers);
        const paths = new Map(solution.routes.map(route => ([_drivers[route.vehicle], route.geometry])));
        // newPaths.forEach((path, driver) => paths.set(driver, path));
        setPaths(paths);
        solutions.set(snapshotId, solution)
        setCurrentSolutionId(snapshotId);
        setSolutions(new Map(solutions));
        setWorking(false);
    }

    function clearAll() {
        const ids = activeItems.pluck('OrderId').all();
        dispatch({ type: 'assign', ids, driver: 'UNASSIGNED' });
        setPaths(new Map())
    }

    function reassignRoute(from, to) {
        const toPath = paths.get(to);
        const fromPath = paths.get(from);

        if (!toPath || !fromPath) return;

        paths.set(to, fromPath);
        paths.set(from, toPath);

        dispatch({ type: 'swap-route', from, to })

        setPaths(paths);
    }

    function reassignItem(id, driver) {
        dispatch({ type: 'assign', ids: [id], driver })
    }

    function Drop(transferredData, target, e) {
        const { type, id, selected } = transferredData;
        console.log('Drop', transferredData, target, e.currentTarget, e.target);

        switch (type) {
            case 'item': {
                const fromItem = store.get(id);
                const toItem = store.get(e.target.id);
                if (toItem && toItem.Driver === fromItem.Driver) {
                }
                else {
                    dispatch({ type: 'assign', ids: selected, driver: target });
                }
                break;
            }
            case 'header': {
                reassignRoute(target, id);
                break;
            }
            default: {
                const ids = items.where(type, id).pluck('OrderId').all();
                dispatch({ type: 'assign', ids, driver: target })
            }
        }
    }

    // function GroupHeaderClick(id) {
    //   const splitId = id.split(', ');
    //   const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
    //   setSuburb(suburb);
    // }

    function MarkerClick(id) {
        if (mapEditMode.id) {
            dispatch({ type: 'assign', ids: [id], driver: mapEditMode.id });
            return;
        }
        setSelectedMarkerId(id)
    }

    function MarkerRightClick(id) {
        if (quickChange) {
            const next = quickChange + 1;
            store.get(id).Sequence = next;
            setQuickChange(next)
            return;
        }
        setQuickChange(store.get(id).Sequence);
    }

    function SelectionComplete(e) {
        console.log(e.bounds);
        const ids = activeItems.filter(item => e.bounds.contains(LatLng(item.GeocodedAddress))).pluck('OrderId').all();
        dispatch({ type: 'assign', ids, driver: mapEditMode.id })
    }

    function SelectionChange(ids) {
        setMapEditMode({ ...mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
    }

    function MaximizeEnd(id) {
        setMapEditMode({ on: false, id: null, tool: null })
        setSelectedDrivers(id ? [id] : [])
    }

    function EditModeClick() {
        setPaths(new Map())
        setMapEditMode({ on: true })
    }

    function MapRightClick() {
        if (!mapEditMode.id) return;
        const tool = mapEditMode.tool === 'rectangle' ? 'pointer' : 'rectangle'
        setMapEditMode({ ...mapEditMode, tool })
    }


    const state = {
        filter, setFilter,
        groupBy, setGroupBy,
        mapEditMode, //setMapEditMode,
        quickChange, //setQuickChange,
        selectedDrivers, //setSelectedDrivers,
        selectedMarkerId, setSelectedMarkerId,
        working, //setWorking,
        solutions,
        currentSolutionId,
        // derived
        activeItems,
        activePaths,
        filteredItems,
        isFiltered,
        selectedItem,
        sidebarContent, setSidebarContent,
    };

    const actions = {
        'undo': () => dispatch({ type: 'undo' }),
        'apply-snapshot': id => {
            dispatch({ type: 'apply-snapshot', id });
            const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
            const paths = new Map(solutions.get(id).routes.map(route => ([_drivers[route.vehicle], route.geometry])));
            // newPaths.forEach((path, driver) => paths.set(driver, path));
            setPaths(paths);
        },
        'remove-snapshot': id => {
            solutions.delete(id);
            dispatch({ type: 'remove-snapshot', id });
            // const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
            // const paths = new Map(solutions.get(id).routes.map(route => ([_drivers[route.vehicle], route.geometry])));
            // // newPaths.forEach((path, driver) => paths.set(driver, path));
            // setPaths(paths);
        },
        'clear-history': () => {
            const current = [...solutions].pop();
            setSolutions(new Map([current]));
            // solutions.clear();
            dispatch({ type: 'clear-snapshots' });
            // const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
            // const paths = new Map(solutions.get(id).routes.map(route => ([_drivers[route.vehicle], route.geometry])));
            // // newPaths.forEach((path, driver) => paths.set(driver, path));
            // setPaths(paths);
        },
        'group-items': groupItems,
        'auto-assign': autoAssign,
        'clear-all': clearAll,
        'reassign-item': reassignItem,
        'reassign-route': reassignRoute,
        'drop': Drop,
        'marker-click': MarkerClick,
        'marker-rightclick': MarkerRightClick,
        'selection-complete': SelectionComplete,
        'selection-change': SelectionChange,
        'maximize-end': MaximizeEnd,
        'editmode-click': EditModeClick,
        'map-rightclick': MapRightClick,
    }

    const dispatcher = type => actions[type];

    return <>{props.children([state, dispatcher])}</>
}
