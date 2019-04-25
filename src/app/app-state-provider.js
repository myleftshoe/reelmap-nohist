import React, { useState, useMemo, useEffect } from 'react'
import { useStore } from 'outstated'
import dataStore from './mock-data-store'
import toastStore from '../toasts/store'
import Filter from '../common/filter'
import { LatLng, Bounds } from '../map/utils'
import vroom from '../map/services/vroom2'
import osrmTrip from '../map/services/osrm'
import collect from 'collect.js';
import { drivers } from '../common/constants'
import mapMove from '../utils/map-move';
import { SolutionToast } from '../toasts';
import useDict from '../hooks/useDict';
import useJsonDict from '../hooks/useJsonDict';
import useToggle from '../hooks/useToggle';
import move from 'lodash-move';

export default function StateProvider(props) {

    const [store, dispatch] = useStore(dataStore);
    const [toasts, toastActions] = useStore(toastStore);
    const [toast, setToast] = useState({});
    const [selectedMarkerId, setSelectedMarkerId] = useState();
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [mapEditMode, setMapEditMode] = useState({ on: true, id: null, tool: null });
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('City');
    // const [suburb, setSuburb] = useState('');
    const [routes, setRoutes] = useState(new Map());
    const [busy, setBusy] = useState(false);
    const solutions = useDict();
    const snapshots = useJsonDict();
    const [maxPaneId, setMaxPaneId] = useState();

    // !important: useDict causes clear and delete
    // to error unless () => is used.
    toastActions.onClear(() => solutions.clear());
    toastActions.onRemove(id => solutions.delete(id));
    toastActions.onSelect(applySnapshot);

    console.log(solutions)

    const coerce = property => item => {
        const value = item[property];
        return Number(value) || value;
    }

    const items = collect([...store.values()]).sortBy(coerce(sortBy));

    const filteredItems = useMemo(() => collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes'])), [items]);
    const isFiltered = Boolean(filter && filteredItems.count())

    const activeItems = useMemo(
        () => selectedDrivers.length ? items.whereIn('Driver', selectedDrivers) : items,
        [items, selectedDrivers]
    );

    let activeRoutes = [...routes.entries()].map(([key, value]) => ({ key, value }));
    if (selectedDrivers.length) {
        activeRoutes = selectedDrivers.map(key => ({ key, value: routes.get(key) || '' }));
    }

    // const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
    const selectedItem = store.get(selectedMarkerId);

    async function autoAssign({ balanced = false }) {

        setBusy(true);

        const unassignedIds = items.where('Driver', 'UNASSIGNED').pluck('OrderId').all();

        let result = await vroom(drivers, items);

        const slackTime = result.slackTime;
        if (balanced && slackTime > 3600) {
            unassignedIds.forEach(id => store.get(id).Driver = 'UNASSIGNED')

            const averageSlackTime = slackTime / drivers.size - 2400;
            const reducedDrivers = new Map();
            drivers.forEach((value, key) => {
                const driver = { ...value };
                driver.end = Math.trunc(driver.end - averageSlackTime)
                reducedDrivers.set(key, driver)
            })
            result = await vroom(reducedDrivers, items)
        }
        const { solution, routes: newRoutes } = result;

        setRoutes(new Map(newRoutes));

        const snapshotId = Date.now();
        solutions.set(snapshotId, newRoutes)
        snapshots.set(snapshotId, store);

        const toast = new SolutionToast(snapshotId, solution);
        toastActions.add(toast.id, toast);
        setToast(toast);

        setBusy(false);
    }

    async function recalcRoute(driver) {
        if (driver === 'UNASSIGNED') return;
        setBusy(true);
        const { route } = await osrmTrip(driver, items);
        routes.set(driver, route);
        setRoutes(new Map(routes));
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
        setRoutes(new Map())
    }

    function reassignRoute(from, to) {
        dispatch({ type: 'swap-route', from, to })
        setRoutes(mapMove(routes, to, from));
    }

    function reverseRoute(driver) {
        const driverItems = items.where('Driver', driver).sortBy('Sequence').all();
        dispatch({ type: 'reverse', items: driverItems })
        // setPaths(mapMove(paths, to, from));
    }

    function reassignItem(id, driver) {
        console.log('yyy reassigne')
        const fromDriver = store.get(id).Driver;
        dispatch({ type: 'assign', ids: [id], driver })
        recalcRoute(fromDriver);
        if (driver !== fromDriver)
            recalcRoute(driver);
        console.log(fromDriver)
    }

    function Drop(transferredData, target, e) {
        const { type, id, selected } = transferredData;
        console.log('Drop', transferredData, target, e.currentTarget, e.target);
        const fromItem = store.get(id);

        switch (type) {
            case 'item': {
                // const fromItem = store.get(id);
                const toItem = store.get(e.target.id);
                if (toItem && toItem.Driver === fromItem.Driver) {
                    const driverItems = items.where('Driver', toItem.Driver).sortBy('Sequence').all();
                    dispatch({ type: 'move', items: driverItems, fromItem, toItem });
                    recalcRoute(fromItem.Driver)
                }
                else {
                    const drivers = items.whereIn('OrderId', selected).pluck('Driver').push(target).unique();
                    dispatch({ type: 'assign', ids: selected, driver: target });
                    console.log('yyyy', drivers.all())
                    drivers.each(recalcRoute)
                }
                break;
            }
            case 'header': {
                reassignRoute(target, id);
                break;
            }
            default: {
                const ids = items.where(type, id).pluck('OrderId').all();
                const drivers = items.where(type, id).pluck('Driver').push(target).unique();
                console.log(id, type, target, drivers)
                dispatch({ type: 'assign', ids, driver: target })
                drivers.each(recalcRoute)
            }
        }
    }

    async function MarkerClick(id) {
        if (mapEditMode.id) {
            dispatch({ type: 'assign', ids: [id], driver: mapEditMode.id })
            const result = await vroom(drivers, items);
            const { routes } = result;
            setRoutes(new Map(routes));
            return;
        }
        setSelectedMarkerId(id)
    }


    function SelectionChange(ids) {
        setMapEditMode({ ...mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
    }

    function MaximizeEnd(id) {
        // setMapEditMode({ on: false, id: null, tool: null })
        setSelectedDrivers(id ? [id] : [])
        setMaxPaneId(id);
        setSelectedDrivers(id ? [id] : []);
        // setTimeout(() => setSelectedDrivers(id ? [id] : []), 0);
    }

    function MapClick(map) {
        setSelectedMarkerId(null);
        setMapEditMode({});
    }

    function applySnapshot(id) {
        dispatch({ type: 'set', state: snapshots.get(id) });
        setRoutes(new Map(solutions.get(id)));
    }

    const state = {
        filter, setFilter,
        sortBy, setSortBy,
        mapEditMode,
        selectedDrivers, setSelectedDrivers,
        selectedMarkerId, setSelectedMarkerId,
        busy, //setBusy,
        // derived
        activeItems,
        activeRoutes,
        filteredItems,
        isFiltered,
        selectedItem,
        toast,
        toasts,
        items,
        maxPaneId, setMaxPaneId,
        routes
    };

    const actions = {
        'auto-assign': autoAssign,
        'clear-all': clearAll,
        'reassign-item': reassignItem,
        'reassign-route': reassignRoute,
        'reverse-route': reverseRoute,
        'drop': Drop,
        'marker-click': MarkerClick,
        'selection-complete': SelectionComplete,
        'selection-change': SelectionChange,
        'maximize-end': MaximizeEnd,
        'map-click': MapClick,
    }

    const dispatcher = type => actions[type];

    return <>{props.children([state, dispatcher])}</>
}
