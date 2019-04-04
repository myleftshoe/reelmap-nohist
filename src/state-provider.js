import React, { useState } from 'react'
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Filter from './components/filter'
import { LatLng } from './map/utils'
import vroom from './map/services/vroom2'
import collect from 'collect.js';
import { drivers } from './constants'


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

    const items = collect([...store.values()]).sortBy(groupBy.split(',')[0]);

    const filteredItems = collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']));
    const isFiltered = Boolean(filter && filteredItems.count())

    let activeItems = items;
    let activePaths = [...paths.entries()].map(([driver, path]) => ({ driver, path }));
    if (selectedDrivers.length) {
        activeItems = items.whereIn('Driver', selectedDrivers);
        activePaths = selectedDrivers.map(driver => ({ driver, path: paths.get(driver) || '' }));
    }

    // const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
    const selectedItem = store.get(selectedMarkerId);


    const _dispatch = {

        async autoAssign() {
            const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
            if (!activeItems.count()) return;
            setWorking(true);
            setMapEditMode({ ...mapEditMode, on: false })
            const { paths: newPaths, newItems } = await vroom(activeItems.all(), _drivers);
            newPaths.forEach((path, driver) => paths.set(driver, path));
            setPaths(paths);
            setWorking(false);
        },

        clearAll() {
            const ids = activeItems.pluck('OrderId').all();
            dispatch({ type: 'assign', ids, driver: 'UNASSIGNED' });
            setPaths(new Map())
        },

        reassignRoute(from, to) {
            const toPath = paths.get(to);
            const fromPath = paths.get(from);

            if (!toPath || !fromPath) return;

            paths.set(to, fromPath);
            paths.set(from, toPath);

            dispatch({ type: 'swap-route', from, to })

            setPaths(paths);
        },

        reassignItem(id, driver) {
            dispatch({ type: 'assign', ids: [id], driver })
        },

        Drop(transferredData, target, e) {
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
                    this.reassignRoute(target, id);
                    break;
                }
                default: {
                    const ids = items.where(type, id).pluck('OrderId').all();
                    dispatch({ type: 'assign', ids, driver: target })
                }
            }
        },

        // function GroupHeaderClick(id) {
        //   const splitId = id.split(', ');
        //   const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
        //   setSuburb(suburb);
        // },

        MarkerClick(id) {
            if (mapEditMode.id) {
                dispatch({ type: 'assign', ids: [id], driver: mapEditMode.id });
                return;
            }
            setSelectedMarkerId(id)
        },

        MarkerRightClick(id) {
            if (quickChange) {
                const next = quickChange + 1;
                store.get(id).Sequence = next;
                setQuickChange(next)
                return;
            }
            setQuickChange(store.get(id).Sequence);
        },

        SelectionComplete(e) {
            console.log(e.bounds);
            const ids = activeItems.filter(item => e.bounds.contains(LatLng(item.GeocodedAddress))).pluck('OrderId').all();
            dispatch({ type: 'assign', ids, driver: mapEditMode.id })
        },

        SelectionChange(ids) {
            setMapEditMode({ ...mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
        },

        MaximizeEnd(id) {
            setMapEditMode({ on: false })
            setSelectedDrivers(id ? [id] : [])
        },

        EditModeClick() {
            setPaths(new Map())
            setMapEditMode({ on: true })
        },

        MapRightClick() {
            if (!mapEditMode.id) return;
            const tool = mapEditMode.tool === 'rectangle' ? 'pointer' : 'rectangle'
            setMapEditMode({ ...mapEditMode, tool })
        },
    }

    const state = {
        filter, setFilter,
        groupBy, setGroupBy,
        mapEditMode, //setMapEditMode,
        quickChange, //setQuickChange,
        selectedDrivers, //setSelectedDrivers,
        selectedMarkerId, setSelectedMarkerId,
        working, //setWorking,
        // derived
        activeItems,
        activePaths,
        filteredItems,
        isFiltered,
        selectedItem,
    };

    const dispatcher = type => _dispatch[type];

    return <>{props.children([state, dispatcher])}</>
}
