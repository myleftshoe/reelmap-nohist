import React, { useState } from 'react'
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Filter from './components/filter'
import { LatLng } from './map/utils'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import collect from 'collect.js';

const drivers = ['SAM1', 'DRK', 'CHA'];

export default function StateProvider(props) {

    console.log('rendering');

    const [store, dispatch] = useStore(dataStore);

    const get = {};
    const set = {};

    [get.selectedMarkerId, set.selectMarker] = useState();
    [get.selectedDrivers, set.selectedDrivers] = useState([]);
    [get.mapEditMode, set.mapEditMode] = useState({ on: true, id: null, tool: null });
    [get.quickChange, set.quickChange] = useState();
    [get.filter, set.filter] = useState('');
    [get.groupBy, set.groupBy] = useState('PostalCode,City');
    // const [suburb, setSuburb] = useState('');
    const [paths, setPaths] = useState(new Map());
    [get.working, set.working] = useState(false);

    const items = collect([...store.values()]).sortBy(get.groupBy.split(',')[0]);

    get.filteredItems = collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']));
    get.isFiltered = Boolean(get.filter && get.filteredItems.count())

    get.activeItems = items;
    get.activePaths = [...paths.entries()].map(([driver, path]) => ({ driver, path }));
    if (get.selectedDrivers.length) {
        get.activeItems = items.whereIn('Driver', get.selectedDrivers);
        get.activePaths = get.selectedDrivers.map(driver => ({ driver, path: paths.get(driver) || '' }));
    }

    // const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
    get.selectedItem = store.get(get.selectedMarkerId);
    get.cursor = get.mapEditMode.tool ? circle({ radius: 10, color: colors[get.mapEditMode.id], text: get.quickChange }).cursor : null



    const handle = {

        async autoAssign() {
            const _drivers = get.selectedDrivers.length ? get.selectedDrivers : [...drivers];
            if (!get.activeItems.count()) return;
            set.working(true);
            set.mapEditMode({ ...get.mapEditMode, on: false })
            const { paths: newPaths, newItems } = await vroom(get.activeItems.all(), _drivers);
            newPaths.forEach((path, driver) => paths.set(driver, path));
            setPaths(paths);
            set.working(false);
        },

        clearAll() {
            const ids = get.activeItems.pluck('OrderId').all();
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

        editRoute(id) {
            window.open(`http://localhost:3006/${id}`);
            // if (driver === id)
            //   props.history.goBack();
            // else
            //   props.history.push(`/${id}`);
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
                    handle.reassignRoute(target, id);
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
            if (get.mapEditMode.id) {
                dispatch({ type: 'assign', ids: [id], driver: get.mapEditMode.id });
                return;
            }
            set.selectMarker(id)
        },

        MarkerRightClick(id) {
            if (get.quickChange) {
                const next = get.quickChange + 1;
                store.get(id).Sequence = next;
                set.quickChange(next)
                return;
            }
            set.quickChange(store.get(id).Sequence);
        },

        SelectionComplete(e) {
            console.log(e.bounds);
            const ids = get.activeItems.filter(item => e.bounds.contains(LatLng(item.GeocodedAddress))).pluck('OrderId').all();
            dispatch({ type: 'assign', ids, driver: get.mapEditMode.id })
        },

        SelectionChange(ids) {
            set.mapEditMode({ ...get.mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
        },

        MaximizeEnd(id) {
            set.mapEditMode({ on: false })
            set.selectedDrivers(id ? [id] : [])
        },

        EditModeClick() {
            setPaths(new Map())
            set.mapEditMode({ on: true })
        },

        MapRightClick() {
            if (!get.mapEditMode.id) return;
            const tool = get.mapEditMode.tool === 'rectangle' ? 'pointer' : 'rectangle'
            set.mapEditMode({ ...get.mapEditMode, tool })
        },
    }
    return <>{props.children(get, set, handle)}</>
}
