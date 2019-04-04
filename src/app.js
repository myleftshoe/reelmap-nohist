import React, { useState } from 'react'
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Minibar from './components/minibar'
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import Group from './components/group'
import Filter from './components/filter'
import { groupBy2 } from './utils/utils'
import GoogleMap from './map/map'
import { InfoWindow } from '@googlemap-react/core'
// import { labeledIcon } from './map/markers/markers.js'
import { LatLng } from './map/utils'
// import ContouredPolygon from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import DepotMarker from './map/depot-marker'
// import move from 'lodash-move';
import Panes from './components/panes';
import collect from 'collect.js';
import CustomControlBar from './map/custom-control-bar';
import RegionSelectControl from './map/region-select-control';
import LoadingIndicator from './components/loading-indicator';
import JobMarkers from './map/job-markers';
import Routes from './map/routes';

const drivers = ['SAM1', 'DRK', 'CHA'];
const panes = [...drivers, 'UNASSIGNED'];

function App(props) {

  console.log('rendering')
  const [store, dispatch] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
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
  const cursor = mapEditMode.tool ? circle({ radius: 10, color: colors[mapEditMode.id], text: quickChange }).cursor : null

  function handleDrop(transferredData, target, e) {
    const { type, id, selected } = transferredData;
    console.log('handleDrop', transferredData, target, e.currentTarget, e.target);

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

  // function handleGroupHeaderClick(id) {
  //   const splitId = id.split(', ');
  //   const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
  //   setSuburb(suburb);
  // }

  function handleMarkerClick(id) {
    if (mapEditMode.id) {
      dispatch({ type: 'assign', ids: [id], driver: mapEditMode.id });
      return;
    }
    selectMarker(id)
  }

  function handleMarkerRightClick(id) {
    if (quickChange) {
      const next = quickChange + 1;
      store.get(id).Sequence = next;
      setQuickChange(next)
      return;
    }
    setQuickChange(store.get(id).Sequence);
  }

  function reassignItem(id, driver) {
    dispatch({ type: 'assign', ids: [id], driver })
  }

  async function autoAssign() {
    const _drivers = selectedDrivers.length ? selectedDrivers : [...drivers];
    if (!activeItems.count()) return;
    setWorking(true);
    setMapEditMode({ ...mapEditMode, on: false })
    const { paths: newPaths, newItems } = await vroom(activeItems.all(), _drivers);
    newPaths.forEach((path, driver) => paths.set(driver, path));
    setPaths(paths);
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

  function editRoute(id) {
    window.open(`http://localhost:3006/${id}`);
    // if (driver === id)
    //   props.history.goBack();
    // else
    //   props.history.push(`/${id}`);
  }

  function handleSelectionComplete(e) {
    console.log(e.bounds);
    const ids = activeItems.filter(item => e.bounds.contains(LatLng(item.GeocodedAddress))).pluck('OrderId').all();
    dispatch({ type: 'assign', ids, driver: mapEditMode.id })
  }

  function handleSelectionChange(ids) {
    setMapEditMode({ ...mapEditMode, tool: ids[0] && 'pointer', id: ids[0] })
  }

  function handleMaximizeEnd(id) {
    setMapEditMode({ on: false })
    setSelectedDrivers(id ? [id] : [])
  }

  function handleEditModeClick() {
    setPaths(new Map())
    setMapEditMode({ on: true })
  }

  function handleMapRightClick() {
    if (!mapEditMode.id) return;
    const tool = mapEditMode.tool === 'rectangle' ? 'pointer' : 'rectangle'
    setMapEditMode({ ...mapEditMode, tool })
  }

  return (

    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          <Sidebar.NavButton id='City,PostalCode' active={groupBy === 'City,PostalCode'} onClick={setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
          <Sidebar.NavButton id='PostalCode,City' active={groupBy === 'PostalCode,City'} onClick={setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='OrderId,' active={groupBy === 'OrderId,'} onClick={setGroupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence,' active={groupBy === 'Sequence,'} onClick={setGroupBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='editmode' onClick={handleEditModeClick} tooltip='Auto assign'>scatter_plot</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={autoAssign} tooltip='Auto assign'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='clearall' onClick={clearAll} tooltip='Clear all'>clear_all</Sidebar.NavButton>
          <LoadingIndicator loading={working} />
        </Sidebar.Navigation>
        <Sidebar.Content>
          <Minibar>
            <Filter onChange={setFilter} />
            {/* <Minibar.Button onClick={() => setSortBy('City,PostalCode')}>location_city</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy('PostalCode,City')}>local_post_office</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy([])}>format_list_numbered</Minibar.Button> */}
          </Minibar>
          <Panes
            panes={panes}
            groupBy={'Driver'}
            items={filteredItems}
            isFiltered={isFiltered}
            onDrop={handleDrop}
            onMaximizeEnd={handleMaximizeEnd}
            onOpenInNew={editRoute}
          >
            {items => {
              const groupedItems = groupBy2(items, groupBy);
              const groupKeys = Object.keys(groupedItems);
              return groupKeys.map(groupKey =>
                <Group
                  key={groupKey}
                  id={groupKey.split(',')[0]}
                  type={groupBy.split(',')[0]}
                  items={groupedItems[groupKey]}
                  content={groupKey}
                  // onHeaderClick={handleGroupHeaderClick}
                  onItemClick={selectMarker}
                  activeItemId={selectedMarkerId}
                  flatten={groupKey === 'undefined'}
                  count={groupedItems[groupKey].length}
                  expanded={isFiltered}
                  filter={filter}
                />
              )
            }}
          </Panes>
        </Sidebar.Content>
      </Sidebar >
      <GoogleMap
        onClick={() => selectMarker(null)}
        onRightClick={handleMapRightClick}
        cursor={cursor}
      >
        <DepotMarker
          id={'depot'}
          position={{ lat: -37.688797, lng: 145.005252 }}
          cursor={cursor}
        />
        <JobMarkers
          items={activeItems}
          selectedMarkerId={selectedMarkerId}
          cursor={cursor}
          showLabel={!mapEditMode.on}
          onMarkerClick={handleMarkerClick}
          onMarkerRightClick={handleMarkerRightClick}
          onMarkerMouseOver={selectMarker}
        />
        {selectedMarkerId &&
          <InfoWindow
            anchorId={selectedMarkerId}
            visible={selectedMarkerId}
            onCloseClick={() => selectMarker(null)}
            opts={{ disableAutoPan: true }}
          >
            <MarkerInfoWindowContent
              item={selectedItem}
              color={colors[selectedItem.Driver]}
              onDriverChange={reassignItem}
              dropDownValues={colors}
            />
          </InfoWindow>
        }
        {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
        /> */}
        <Routes hidden={isFiltered} paths={activePaths} onRightClick={reassignRoute} />
        {/* <SuburbBoundary suburb={suburb} /> */}
        {mapEditMode.on &&
          <CustomControlBar small>
            <CustomControlBar.Select onSelectionChanged={handleSelectionChange}>
              {drivers.map(driver =>
                <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>fiber_manual_record</CustomControlBar.IconButton>
              )}
            </CustomControlBar.Select>
            <RegionSelectControl
              id='regionSelectTool'
              title='Region select tool'
              hidden
              active={mapEditMode.tool === 'rectangle'}
              onSelectionComplete={handleSelectionComplete}
              clearOnComplete
              color={colors[mapEditMode.id]}
            />
          </CustomControlBar>
        }
      </GoogleMap>
    </Resizable >

  );
}


export default App;
