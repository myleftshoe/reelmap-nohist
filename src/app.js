import React, { useState } from 'react'
import { css } from '@emotion/core';
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
// import { LatLng } from './map/utils'
// import ContouredPolygon from './map/contoured-polygon'
import { polygon } from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import { BeatLoader } from 'react-spinners'
import JobMarker from './map/job-marker'
import DepotMarker from './map/depot-marker'
import Route from './map/route';
import move from 'lodash-move';
import Panes from './components/panes';
import collect from 'collect.js';

const drivers = ['SAM1', 'DRK', 'CHA'];
const panes = [...drivers, 'UNASSIGNED'];

function App(props) {

  console.log('rendering')

  const [store, updateStore, persist, storeFromArray] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
  const [selectedDriver, selectDriver] = useState();
  const [quickChange, setQuickChange] = useState();
  const [filter, setFilter] = useState('');
  // const [sortBy, setSortBy] = useState();
  const [groupBy, setGroupBy] = useState('PostalCode,City');
  // const [suburb, setSuburb] = useState('');
  const [paths, setPaths] = useState(new Map());
  const [working, setWorking] = useState(false);

  const sortBy = groupBy.split(',')[0];

  const itemsCollection = collect([...store.values()]).sortBy(sortBy);

  const items = itemsCollection.all();
  const selectedDriverItems = itemsCollection.where('Driver', selectedDriver).all();
  const filteredItems = Filter.apply(items, ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']);
  const isFiltered = Boolean(filter && filteredItems.length)

  const activeItems = selectedDriver ? selectedDriverItems : items;
  const activePaths = selectedDriver
    ? [{ driver: selectedDriver, path: paths.get(selectedDriver) || '' }]
    : [...paths.entries()].map(([driver, path]) => ({ driver, path }))

  // const polygonPoints = items.filter(({ Driver }) => (Driver || 'UNASSIGNED') === selectedDriver).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter(latlng => latlng);
  const selectedItem = store.get(selectedMarkerId);
  const cursor = quickChange ? circle({ radius: 16, color: colors[quickChange], text: quickChange }).cursor : null

  // console.log(quickChange, selectedMarkerId, selectedItem, suburb, selectedDriver);
  // console.table(items.sort((a, b) => a.Sequence - b.Sequence), ["Sequence", "OrderId", "City", "PostalCode"]);
  function handleDrop(transferredData, target, e) {
    const { type, id, selected } = transferredData;
    console.log(transferredData, target, e.currentTarget.id);
    if (type === 'item') {
      selected.forEach(id => store.get(id).Driver = target);
    }
    else if (type === 'header' && e.ctrlKey) {
      reassignRoute(target, id);
    }
    else {
      items.filter(({ [type]: prop }) => prop === id).forEach(({ OrderId }) => {
        store.get(OrderId).Driver = target;
      });
    }
    updateStore();
    // updateStore(persist);
  }

  function handleItemDrop(id, e) {
    const transferredData = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log('>>>>>>>>>>>>', id, transferredData);
    const toItem = store.get(id);
    const fromItem = store.get(transferredData.id);
    if (toItem.Driver !== fromItem.Driver) {
      handleDrop(transferredData, toItem.Driver, e)
      return
    }
    const toIndex = items.findIndex(item => item.OrderId === toItem.OrderId)
    const fromIndex = items.findIndex(item => item.OrderId === fromItem.OrderId)
    console.log(fromItem.OrderId, fromIndex, toItem.OrderId, toIndex)
    const _items = move(items, fromIndex, toIndex);
    const _items2 = selectedDriverItems.sort((a, b) => a.Sequence - b.Sequence).map((item, index) => {
      item.Sequence = index + 1;
      return item;
    })
    // console.table(_items2, ['OrderId', 'Street'])
    storeFromArray(_items);
    // updateStore();
  }

  // function handleGroupHeaderClick(id) {
  //   const splitId = id.split(', ');
  //   const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
  //   setSuburb(suburb);
  // }

  // function handleMarkerClick(id) {
  //   console.log(id, quickChange);
  //   if (quickChange) {
  //     store.get(id).Driver = quickChange;
  //     updateStore(persist);
  //   }
  //   else (selectMarker(id))
  // }

  function handleMarkerRightClick(id) {
    if (quickChange) {
      const next = quickChange + 1;
      store.get(id).Sequence = next;
      setQuickChange(next)
      updateStore();
    }
    else
      setQuickChange(store.get(id).Sequence);
  }

  function reassignItem(id, driver) {
    const item = store.get(id);
    item.Driver = driver;
    updateStore();
  }

  function handleMarkerDrop(latLng, id) {
    if (polygon.contains(latLng)) {
      store.get(id).Driver = selectedDriver;
      updateStore();
    }
  }

  async function autoAssign() {
    const _drivers = selectedDriver ? [selectedDriver] : [...drivers];
    if (!activeItems.length) return;
    setWorking(true);
    const { paths: newPaths, newItems } = await vroom(activeItems, _drivers);
    newPaths.forEach((path, driver) => paths.set(driver, path));
    setPaths(paths);
    updateStore();
    setWorking(false);
  }

  function clearAll() {
    activeItems.forEach(item => {
      item.Driver = 'UNASSIGNED';
      item.Sequence = '';
    });
    setPaths(new Map())
    updateStore()
  }

  function reassignRoute(from, to) {

    const toPath = paths.get(to);
    const fromPath = paths.get(from);

    if (!toPath || !fromPath)
      return;

    paths.set(to, fromPath);
    paths.set(from, toPath);

    [...store.values()].forEach(item => {
      if (item.Driver === from) {
        item.Driver = to;
      }
      else if (item.Driver === to) {
        item.Driver = from;
      }
    });

    setPaths(paths);
  }

  function reverseItems() {
  }

  function editRoute(id) {
    window.open(`http://localhost:3006/${id}`);
    // if (driver === id)
    //   props.history.goBack();
    // else
    //   props.history.push(`/${id}`);
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
          {selectedDriver && <>
            {/* <Sidebar.NavButton id='optimize' onClick={autoAssign} tooltip='Optimize route'>timeline</Sidebar.NavButton> */}
            <Sidebar.NavButton id='reverse' onClick={reverseItems} tooltip='Reverse route'>swap_vert</Sidebar.NavButton>
          </>
          }
          <BeatLoader
            css={css`margin-top: auto;`}
            sizeUnit='px'
            size={6}
            color={'#FFF'}
            loading={working}
          />
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
            data={filteredItems}
            isFiltered={isFiltered}
            onDrop={handleDrop}
            onMaximizeEnd={selectDriver}
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
                  content={groupKey}
                  // onClick={() => handleGroupHeaderClick(groupKey)}
                  // flatten={groupKey === 'undefined' || driver}
                  flatten={groupKey === 'undefined'}
                  count={groupedItems[groupKey].length}
                  expanded={isFiltered}
                  filter={filter}
                >
                  {groupedItems[groupKey].map(item =>
                    <Group.Item
                      id={item.OrderId}
                      key={item.OrderId}
                      data={item}
                      filter={filter}
                      // compact={groupKey !== 'undefined' && !driver}
                      compact={groupKey !== 'undefined'}
                      active={item.OrderId === selectedMarkerId}
                      onClick={() => selectMarker(item.OrderId)}
                      onDrop={handleItemDrop}
                    // onMouseOver={() => selectMarker(item.OrderId)}
                    />)
                  }
                </Group>
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
          key={'depot'}
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
            onClick={() => selectMarker(id)}
            onRightClick={() => handleMarkerRightClick(id)}
            onMouseOver={() => selectMarker(id)}
            // onDrag={(e) => console.log(e)}
            onDragEnd={({ latLng }) => handleMarkerDrop(latLng, id)}
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
        {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
          // color={colors[selectedDriver]}
          color={!paths.find(({ driver }) => driver === selectedDriver) ? colors[selectedDriver] : 'transparent'}
          onClick={() => mapState.map.fitBounds(Bounds.from(polygonPoints))}
        /> */}
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
      </GoogleMap>
    </Resizable >

  );
}


export default App;
