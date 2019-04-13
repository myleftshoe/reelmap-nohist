import React, { useState, useMemo } from 'react'
import { useStore } from 'outstated'
import dataStore from './mock-data-store'
import toastStore from '../toasts/store'
import Filter from '../common/filter'
import { LatLng } from '../map/utils'
import vroom from '../map/services/vroom2'
import collect from 'collect.js';
import { drivers } from '../common/constants'
import mapMove from '../utils/map-move';
import { SolutionToast } from '../toasts';
import useDict from '../hooks/useDict';
import useJsonDict from '../hooks/useJsonDict';
import useToggle from '../hooks/useToggle';

export default function StateProvider(props) {

    const [store, dispatch] = useStore(dataStore);
    const [toasts, toastActions] = useStore(toastStore);
    const [toast, setToast] = useState({});
    const [selectedMarkerId, setSelectedMarkerId] = useState();
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [mapEditMode, setMapEditMode] = useState({ on: true, id: null, tool: null });
    const [quickChange, setQuickChange] = useState();
    const [showPaths, toggleShowPaths] = useToggle(true);
    const [filter, setFilter] = useState('');
    const [groupBy, setGroupBy] = useState('PostalCode,City');
    // const [suburb, setSuburb] = useState('');
    const [paths, setPaths] = useState(new Map());
    const [busy, setBusy] = useState(false);
    const solutions = useDict();
    const snapshots = useJsonDict();

    //!important: useDict causes clear and delete
    //to error inless () => is used.
    toastActions.onClear(() => solutions.clear());
    toastActions.onRemove(id => solutions.delete(id));
    toastActions.onSelect(applySnapshot);

    console.log(solutions)

    const items = collect([...store.values()]).sortBy(groupBy.split(',')[0]);

    const filteredItems = useMemo(() => collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes'])), [items]);
    const isFiltered = Boolean(filter && filteredItems.count())

    const activeItems = useMemo(
        () => selectedDrivers.length ? items.whereIn('Driver', selectedDrivers) : items,
        [items, selectedDrivers]
    );

    let activePaths = [...paths.entries()].map(([driver, path]) => ({ driver, path }));
    if (selectedDrivers.length) {
        activePaths = selectedDrivers.map(driver => ({ driver, path: paths.get(driver) || '' }));
    }

    // const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
    const selectedItem = store.get(selectedMarkerId);

    async function autoAssign() {

        if (!activeItems.count()) return;
        // if (snapshots.contains(store)) return;

        const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];

        setBusy(true);
        // setMapEditMode({ on: false, id: null, tool: null });

        const snapshotId = Date.now();

        const { paths, newItems, solution } = await vroom(activeItems.all(), _drivers);
        // const paths = new Map(solution.routes.map(route => ([_drivers[route.vehicle], route.geometry])));
        setPaths(paths);
        console.log(paths)
        solutions.set(snapshotId, solution)

        // dispatch({ type: 'add-snapshot', id: snapshotId });
        snapshots.set(snapshotId, store);
        const toast = new SolutionToast(snapshotId, solution);
        toastActions.add(toast.id, toast);
        setToast(toast);
        if (!showPaths) toggleShowPaths();
        setBusy(false);
    }



    async function recalcRoute(driver) {
        setBusy(true);
        const { solution } = await vroom(items.where('Driver', driver).all(), [driver]);
        if (solution)
            paths.set(driver, solution.routes[0].geometry);
        else
            paths.delete(driver);
        setPaths(new Map(paths));
        // if (!showPaths) toggleShowPaths();
        setBusy(false);
    }

    function SelectionComplete(e) {
        const selected = activeItems.filter(item => e.bounds.contains(LatLng(item.GeocodedAddress))).pluck('Driver', 'OrderId');
        const ids = selected.keys().all();
        const drivers = new Set(selected.values().unique().all());
        drivers.add(mapEditMode.id);
        dispatch({ type: 'assign', ids, driver: mapEditMode.id });
        [...drivers].forEach(recalcRoute);
    }

    function clearAll() {
        const ids = activeItems.pluck('OrderId').all();
        dispatch({ type: 'assign', ids, driver: 'UNASSIGNED' });
        setPaths(new Map())
    }

    function reassignRoute(from, to) {
        dispatch({ type: 'swap-route', from, to })
        setPaths(mapMove(paths, to, from));
    }

    function reassignItem(id, driver) {
        const fromDriver = store.get(id).Driver;
        dispatch({ type: 'assign', ids: [id], driver })
        recalcRoute(fromDriver);
        recalcRoute(driver);
        console.log(fromDriver)

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
            reassignItem(id, mapEditMode.id);
            // dispatch({ type: 'assign', ids: [id], driver: mapEditMode.id });
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

    function SelectionChange(ids) {
        setMapEditMode({ ...mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
    }

    function MaximizeEnd(id) {
        setMapEditMode({ on: false, id: null, tool: null })
        setSelectedDrivers(id ? [id] : [])
    }

    function EditModeClick() {
        // setPaths(new Map())
        toggleShowPaths();
        // setMapEditMode({ on: true });
    }

    function MapRightClick() {
        if (!mapEditMode.id) return;
        const tool = mapEditMode.tool === 'rectangle' ? 'pointer' : 'rectangle'
        setMapEditMode({ ...mapEditMode, tool })
    }

    function applySnapshot(id) {
        dispatch({ type: 'set', state: snapshots.get(id) });
        const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
        const paths = new Map(solutions.get(id).routes.map(route => ([_drivers[route.vehicle], route.geometry])));
        setPaths(paths);
    }

    const state = {
        filter, setFilter,
        groupBy, setGroupBy,
        mapEditMode, //setMapEditMode,
        quickChange, //setQuickChange,
        selectedMarkerId, setSelectedMarkerId,
        busy, //setBusy,
        // derived
        activeItems,
        activePaths,
        filteredItems,
        isFiltered,
        selectedItem,
        toast,
        toasts,
        showPaths
    };

    const actions = {
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
