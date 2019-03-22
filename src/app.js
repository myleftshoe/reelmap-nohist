/* global google */
import React, { useState, useContext } from 'react'
import { css } from '@emotion/core';
import { useStore } from 'outstated'
import dataStore from './stores/data-store'
import Minibar from './components/minibar'
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import Pane from './components/pane'
import Group from './components/group'
import Badge from './components/badge'
import Filter from './components/filter'
import ArrayX from './utils/arrayx'
import GoogleMap from './map/map'
import { GoogleMapContext, InfoWindow, Marker, Polyline, Polygon } from '@googlemap-react/core'
// import { labeledIcon } from './map/markers/markers.js'
import { LatLng, Bounds } from './map/utils'
import ContouredPolygon, { polygon } from './map/contoured-polygon'
import SuburbBoundary from './map/suburb-boundary'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import { BeatLoader } from 'react-spinners';

// const driver = window.location.pathname.split('/')[1];
const allDrivers = ['SAM1', 'DRK', 'CHA'];

function App(props) {

  const driver = props.match.params.id;
  console.log(driver)
  const drivers = (driver && [driver]) || allDrivers;

  const [store, updateStore, persist] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
  const [selectedDriver, selectDriver] = useState();
  const [quickChange, setQuickChange] = useState();
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('PostalCode,City');
  const [suburb, setSuburb] = useState('');
  const [panes, setPanes] = useState([...drivers, 'UNASSIGNED']);
  const { state: mapState } = useContext(GoogleMapContext);
  const [paths, setPaths] = useState([]);
  const [working, setWorking] = useState(false);

  if (drivers.length + 1 !== panes.length) {
    setPanes([...drivers, 'UNASSIGNED'])
  }

  let activePaths = [...paths];
  if (driver) {
    const path = paths.find(path => path.driver === driver);
    activePaths = path ? [path] : [];
    // activePaths = [paths.find(path => path.driver === driver)]
  }
  console.log(activePaths, paths)

  console.log(driver)
  let items = [...store.values()];
  if (driver) items = items.filter(({ Driver }) => Driver === driver);

  // console.log(items)
  const filteredData = ArrayX.sortByProperty(Filter.apply(items, ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']), sortBy);
  const isFiltered = Boolean(filter && filteredData.length)
  const polygonPoints = items.filter(({ Driver }) => (Driver || 'UNASSIGNED') === selectedDriver).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter(latlng => latlng);
  const selectedItem = store.get(selectedMarkerId);
  const cursor = quickChange ? circle({ radius: 16, color: colors[quickChange], text: quickChange }).cursor : null

  console.log(quickChange, selectedMarkerId, selectedItem, suburb, selectedDriver);
  // console.table(items.sort((a, b) => a.Sequence - b.Sequence), ["Sequence", "OrderId", "City", "PostalCode"]);
  function handleDrop(transferredData, target, e) {
    const { type, id, selected } = transferredData;
    console.log(transferredData, target);
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
  // function openInNewTab(url) {
  //   var win = window.open(url, '_blank');
  //   win.focus();
  // }

  function handleGroupHeaderClick(id) {
    const splitId = id.split(', ');
    const suburb = (Boolean(Number(splitId[0]))) ? splitId[1] : splitId[0];
    setSuburb(suburb);
  }

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

  function handleMarkerDrop(latLng, id) {
    if (polygon.contains(latLng)) {
      store.get(id).Driver = selectedDriver;
      updateStore();
    }
  }

  async function autoAssign() {
    setWorking(true);
    const { paths, newItems } = await vroom(items, [...drivers]);
    setPaths(paths);
    updateStore();
    setWorking(false);
  }

  function clearAll() {
    [...store.values()].forEach(item => {
      // item.Driver = 'UNASSIGNED';
      item.Sequence = '';
    });
    setPaths([])
    updateStore()
  }

  function reassignRoute(from, to) {
    const _paths = new Map([...paths.map(({ driver, path }) => [driver, path])]);
    // console.log(_paths);
    const toPath = _paths.get(to);
    const fromPath = _paths.get(from);
    if (!toPath || !fromPath)
      return;
    _paths.set(to, fromPath);
    _paths.set(from, toPath);
    [...store.values()].forEach(item => {
      if (item.Driver === from) {
        item.Driver = to;
      }
      else if (item.Driver === to) {
        item.Driver = from;
      }
    });
    // console.table([...store.values()], ['OrderId', 'Driver']);
    const p = [..._paths.entries()].map(([driver, path]) => ({ driver, path }));
    console.log(p)
    setPaths(p);
    // setPaths(_paths.entries().map((driver, path) => ({ driver, path })))

    // updateStore()
  }

  function editRoute(id) {
    if (driver === id)
      props.history.goBack();
    else
      props.history.push(`/${id}`);
  }

  return (

    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          <Sidebar.NavButton id='City' active={sortBy === 'City'} onClick={setSortBy} tooltip='Sort by suburb'>location_city</Sidebar.NavButton>
          {/* <Sidebar.NavButton active={groupBy === 'Driver'} onClick={() => setSortBy('Driver')}>people</Sidebar.NavButton> */}
          <Sidebar.NavButton id='PostalCode' active={sortBy === 'PostalCode'} onClick={setSortBy} tooltip='Sort by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence' active={sortBy === 'Sequence'} onClick={setSortBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='optimize' onClick={autoAssign} tooltip='Optimize route'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='reverse' onClick={autoAssign} tooltip='Reverse route'>swap_vert</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={clearAll} tooltip='Clear all'>clear_all</Sidebar.NavButton>
          <Sidebar.NavButton id='avoidtolls' onClick={clearAll} tooltip='Avoid tolls'>toll</Sidebar.NavButton>
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
          {
            panes.map(paneKey => {
              const filteredByDriver = filteredData.filter(({ Driver }) => Driver === paneKey || !Driver);
              return (
                <Pane
                  key={paneKey}
                  onReorder={setPanes}
                  expanded={true}
                  id={paneKey}
                  onDrop={(_, e) => handleDrop(_, paneKey, e)}
                  onMouseOver={() => selectDriver(paneKey)}
                // onClick={() => window.open(`http://localhost:3006/${paneKey}`)}
                // onClick={() => props.history.push(`/${paneKey}`)}
                >
                  <Pane.Header active={paneKey === selectedDriver} color={colors[paneKey]} type='header' id={paneKey} draggable>
                    {active => <>
                      {paneKey}
                      <div>
                        {/* <Minibar.Button id={paneKey} visible={active} onClick={editRoute}>{driver === paneKey ? 'visibility' : 'visibility_off'}</Minibar.Button> */}
                        <Minibar.Button id={paneKey} visible={active} onClick={editRoute}>{driver === paneKey ? 'done' : 'edit'}</Minibar.Button>
                        {/* <a href={`http://localhost:3006/${paneKey}`}><Pane.Header.Icon visible={active} >open_in_new</Pane.Header.Icon></a> */}
                        <Badge color={isFiltered && filteredByDriver.length ? '#FACF00' : null}>{filteredByDriver.length}</Badge>
                      </div>
                    </>
                    }
                  </Pane.Header>
                  <Group.Items>
                    {filteredByDriver.map(item =>
                      <Group.Item
                        id={item.OrderId}
                        key={item.OrderId}
                        data={item}
                        filter={filter}
                        // compact={groupKey !== 'undefined'}
                        active={item.OrderId === selectedMarkerId}
                        onClick={() => selectMarker(item.OrderId)}
                      // onMouseOver={() => selectMarker(item.OrderId)}
                      />)
                    }
                  </Group.Items>
                </Pane>
              )
            })
          }
        </Sidebar.Content>
      </Sidebar >
      <GoogleMap
        onClick={() => selectMarker(null)}
        onRightClick={() => setQuickChange(null)}
        cursor={cursor}
      >
        <Marker
          key={'depot'}
          id={'depot'}
          opts={{
            draggable: true,
            // label: id,
            position: { lat: -37.688797, lng: 145.005252 },
            icon: {
              // url: `https://cdn.iconscout.com/icon/premium/png-256-thumb/map-pin-121-864982.png`,
              url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
              // scaledSize: window.google && new google.maps.Size(40, 40)
            },
            // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
            // icon: labeledIcon({label:id, color: colors[Driver]}),
            cursor
          }}
        />
        {filteredData.map(({ OrderId: id, GeocodedAddress, Driver, Sequence }) => {
          if (!GeocodedAddress) return null;
          const driver = Driver || 'UNASSIGNED'
          return <Marker
            key={id}
            id={id}
            opts={{
              draggable: true,
              // label: `${Sequence}`,
              label: Sequence && {
                text: `${Sequence}`,
                color: 'black',
                fontSize: '10px',
                fontWeight: 'bold',
              },
              position: { lat: GeocodedAddress.latitude, lng: GeocodedAddress.longitude },
              icon: {
                url: `http://maps.google.com/mapfiles/ms/icons/${colors[driver]}.png`,
                labelOrigin: new google.maps.Point(15, 10)
              },
              // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
              // icon: labeledIcon({label:id, color: colors[Driver]}),
              cursor
            }}
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
          {selectedMarkerId && <MarkerInfoWindowContent item={selectedItem} color={colors[selectedItem.Driver]} />}
        </InfoWindow>
        {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
          // color={colors[selectedDriver]}
          color={!paths.find(({ driver }) => driver === selectedDriver) ? colors[selectedDriver] : 'transparent'}
          onClick={() => mapState.map.fitBounds(Bounds.from(polygonPoints))}
        /> */}
        {!isFiltered && activePaths.map(({ path, driver }) => {
          // console.log(path)
          const points = google.maps.geometry.encoding.decodePath(path)
            .map(point => point.toJSON());
          // console.log(points)
          return <React.Fragment key={'path' + driver}>
            <Polyline key={'polyline' + driver} id={driver}
              opts={{
                clickable: true,
                path: points,
                geodesic: true,
                strokeColor: colors[driver],
                strokeOpacity: 0.5,
                strokeWeight: 5, // 33 is the max
                strokePosition: 2, //window.google.maps.StrokePosition.OUTSIDE,
                fillColor: colors[driver],
                fillOpacity: 0.5,
              }}
            // onClick={onClick}
            />
            <Polygon key={'polygon' + driver} id={'polygon' + driver}
              opts={{
                clickable: true,
                path: points,
                geodesic: true,
                strokeColor: colors[driver],
                strokeOpacity: driver === (selectedDriver || driver) ? 0.16 : 0.0,
                strokeWeight: 33, // 33 is the max
                strokePosition: 2, //window.google.maps.StrokePosition.OUTSIDE,
                fillColor: colors[driver],
                fillOpacity: driver === (selectedDriver || driver) ? 0.16 : 0.0,
              }}
              onClick={() => mapState.map.fitBounds(Bounds.from(points))}
              onRightClick={() => reassignRoute(driver)} />
          </React.Fragment>
        })}
        <SuburbBoundary suburb={suburb} />
      </GoogleMap>
    </Resizable >

  );
}


export default App;
