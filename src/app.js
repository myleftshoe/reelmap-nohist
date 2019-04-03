import React, { useState } from 'react'
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Minibar from './components/minibar'
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import Group from './components/group'
import Filter from './components/filter'
import ArrayX from './utils/arrayx'
import GoogleMap from './map/map'
import { InfoWindow } from '@googlemap-react/core'
// import { labeledIcon } from './map/markers/markers.js'
import { LatLng } from './map/utils'
import ContouredPolygon from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import JobMarker from './map/job-marker'
import DepotMarker from './map/depot-marker'
import Route from './map/route';
import move from 'lodash-move';
import Panes from './components/panes';
import collect from 'collect.js';
import CustomControlBar from './map/custom-control-bar';
import RegionSelectControl from './map/region-select-control';
import LoadingIndicator from './components/loading-indicator';

const drivers = ['SAM1', 'DRK', 'CHA'];
const panes = [...drivers, 'UNASSIGNED'];

function App(props) {

  console.log('rendering')

  const [store, dispatch] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [regionSelectId, setRegionSelectId] = useState();
  const [editMode, setEditMode] = useState();
  const [quickChange, setQuickChange] = useState();
  const [filter, setFilter] = useState('');
  // const [sortBy, setSortBy] = useState();
  const [groupBy, setGroupBy] = useState('PostalCode,City');
  const [suburb, setSuburb] = useState('');
  const [paths, setPaths] = useState(new Map());
  const [working, setWorking] = useState(false);

  const sortBy = groupBy.split(',')[0];

  const items = collect([...store.values()]).sortBy(sortBy);

  const filteredItems = collect(Filter.apply(items.all(), ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']));
  const isFiltered = Boolean(filter && filteredItems.count())

  let activeItems = items;
  let activePaths = [...paths.entries()].map(([driver, path]) => ({ driver, path }));
  if (selectedDrivers.length) {
    activeItems = items.whereIn('Driver', selectedDrivers);
    activePaths = selectedDrivers.map(driver => ({ driver, path: paths.get(driver) || '' }));
  }

  const polygonPoints = items.where('City', suburb).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter().all();
  const selectedItem = store.get(selectedMarkerId);
  const cursor = editMode && regionSelectId ? circle({ radius: 10, color: colors[regionSelectId], text: quickChange }).cursor : null


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

  function handleGroupHeaderClick(id) {
    const splitId = id.split(', ');
    const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
    setSuburb(suburb);
  }

  function handleMarkerClick(id) {
    console.log(id, quickChange);
    if (regionSelectId) {
      dispatch({ type: 'assign', ids: [id], driver: regionSelectId });
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
    dispatch({ type: 'assign', ids, driver: regionSelectId })
  }

  function handleSelectionChange(ids) {
    console.log(ids)
    setSelectedDrivers(ids);
    // setRegionSelectId(id);
    // !editMode && selectDriver(id)
  }

  function handleEditControlSelect(id) {
    setEditMode(Boolean(id))
    console.log(id)
    // setRegionSelectId(id);
    // id && selectDriver(id)
  }

  function handleMaximizeEnd(id) {
    setSelectedDrivers(id ? [id] : [])
  }

  return (

    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          {/* <Sidebar.NavButton id='City' active={sortBy === 'City'} onClick={setSortBy} tooltip='Sort by suburb'>location_city</Sidebar.NavButton>
          <Sidebar.NavButton id='PostalCode' active={sortBy === 'PostalCode'} onClick={setSortBy} tooltip='Sort by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence' active={sortBy === 'Sequence'} onClick={setSortBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='optimize' onClick={autoAssign} tooltip='Optimize route'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='reverse' onClick={autoAssign} tooltip='Reverse route'>swap_vert</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={clearAll} tooltip='Clear all'>clear_all</Sidebar.NavButton>
          <Sidebar.NavButton id='avoidtolls' onClick={clearAll} tooltip='Avoid tolls'>toll</Sidebar.NavButton> */}
          <Sidebar.NavButton id='City,PostalCode' active={groupBy === 'City,PostalCode'} onClick={setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
          <Sidebar.NavButton id='PostalCode,City' active={groupBy === 'PostalCode,City'} onClick={setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='OrderId,' active={groupBy === 'OrderId,'} onClick={setGroupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence,' active={groupBy === 'Sequence,'} onClick={setGroupBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
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
              const groupedItems = ArrayX.groupBy2(items, groupBy);
              const groupKeys = Object.keys(groupedItems);
              return groupKeys.map(groupKey =>
                <Group
                  key={groupKey}
                  id={groupKey.split(',')[0]}
                  type={sortBy}
                  items={groupedItems[groupKey]}
                  content={groupKey}
                  onHeaderClick={handleGroupHeaderClick}
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
        onRightClick={() => setQuickChange(null)}
        cursor={cursor}
      >
        <DepotMarker
          id={'depot'}
          position={{ lat: -37.688797, lng: 145.005252 }}
          cursor={cursor}
        />
        {activeItems.map(({ OrderId: id, GeocodedAddress, Driver, Sequence }) => {
          // if (!GeocodedAddress) return null;
          const driver = Driver || 'UNASSIGNED'
          return <JobMarker
            key={id}
            id={id}
            label={Sequence}
            position={GeocodedAddress}
            color={colors[driver]}
            cursor={cursor}
            big={selectedMarkerId === id}
            onClick={() => handleMarkerClick(id)}
            onRightClick={() => handleMarkerRightClick(id)}
            onMouseOver={() => selectMarker(id)}
          />
        })}
        <InfoWindow
          anchorId={selectedMarkerId}
          visible={selectedMarkerId}
          onCloseClick={() => selectMarker(null)}
          opts={{ disableAutoPan: true }}
        >
          {selectedMarkerId &&
            <MarkerInfoWindowContent
              item={selectedItem}
              color={colors[selectedItem.Driver]}
              onDriverChange={reassignItem}
              dropDownValues={colors}
            />
          }
        </InfoWindow>
        <ContouredPolygon
          id='polygon'
          points={polygonPoints}
        />
        {!isFiltered && activePaths.map(({ path, driver }) =>
          // console.log(path)
          <Route
            key={`Route.${driver}`}
            id={`Route.${driver}`}
            path={path}
            color={colors[driver]}
            onRightClick={() => reassignRoute(driver)}
          />
        )}
        {/* <SuburbBoundary suburb={suburb} /> */}
        <CustomControlBar small>
          <CustomControlBar.Select multiple onSelectionChanged={handleSelectionChange}>
            {drivers.map(driver =>
              <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>stop</CustomControlBar.IconButton>
            )}
          </CustomControlBar.Select>
          <CustomControlBar.ButtonGroup onSelectionChanged={handleEditControlSelect}>
            <CustomControlBar.IconButton id='markerSelectTool' title='Marker select tool'>fiber_manual_record</CustomControlBar.IconButton>
            <RegionSelectControl id='regionSelectTool' title='Region select tool' onSelectionComplete={handleSelectionComplete} clearOnComplete color={colors[regionSelectId]} />
          </CustomControlBar.ButtonGroup>
        </CustomControlBar>
      </GoogleMap>
    </Resizable >

  );
}


export default App;
