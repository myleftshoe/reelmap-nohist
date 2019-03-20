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
import vroom from './map/services/vroom'
import { BeatLoader } from 'react-spinners';


function App() {

  const [store, updateStore, persist] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
  const [selectedDriver, selectDriver] = useState();
  const [quickChange, setQuickChange] = useState();
  const [filter, setFilter] = useState('');
  const [groupBy, setGroupBy] = useState('PostalCode,City');
  const [suburb, setSuburb] = useState('');
  const [panes, setPanes] = useState(['CHA', 'DRK', 'SAM1', 'UNASSIGNED']);
  const { state: mapState } = useContext(GoogleMapContext);
  const [paths, setPaths] = useState([]);
  const [working, setWorking] = useState(false);

  const items = [...store.values()];
  const filteredData = ArrayX.sortByProperty(Filter.apply(items, ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']), groupBy.split(',')[0]);
  const isFiltered = Boolean(filter && filteredData.length)
  const polygonPoints = items.filter(({ Driver }) => (Driver || 'UNASSIGNED') === selectedDriver).map(({ GeocodedAddress }) => LatLng(GeocodedAddress)).filter(latlng => latlng);
  const selectedItem = store.get(selectedMarkerId);

  console.log(quickChange, selectedMarkerId, suburb, selectedDriver);

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
      store.get(id).Driver = quickChange;
      updateStore(persist);
    }
    else
      setQuickChange(store.get(id).Driver);
  }

  function handleMarkerDrop(latLng, id) {
    if (polygon.contains(latLng)) {
      store.get(id).Driver = selectedDriver;
      updateStore();
    }
  }

  async function autoAssign() {
    setWorking(true);
    setPaths(await vroom(items))
    setWorking(false);
  }

  function clearAll() {
    [...store.values()].forEach(item => item.Driver = 'UNASSIGNED');
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

  return (

    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          <Sidebar.NavButton id='City,PostalCode' active={groupBy === 'City,PostalCode'} onClick={setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
          {/* <Sidebar.NavButton active={groupBy === 'Driver'} onClick={() => setGroupBy('Driver')}>people</Sidebar.NavButton> */}
          <Sidebar.NavButton id='PostalCode,City' active={groupBy === 'PostalCode,City'} onClick={setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id=',' active={groupBy === ','} onClick={setGroupBy} tooltip='No grouping'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={autoAssign} tooltip='Auto assign'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={clearAll} tooltip='Clear all'>clear_all</Sidebar.NavButton>
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
            {/* <Minibar.Button onClick={() => setGroupBy('City,PostalCode')}>location_city</Minibar.Button>
            <Minibar.Button onClick={() => setGroupBy('PostalCode,City')}>local_post_office</Minibar.Button>
            <Minibar.Button onClick={() => setGroupBy([])}>format_list_numbered</Minibar.Button> */}
          </Minibar>
          {
            panes.map(paneKey => {
              const filteredByDriver = filteredData.filter(({ Driver }) => Driver === paneKey || !Driver);
              const filteredAndGrouped = ArrayX.groupBy2(filteredByDriver, groupBy);
              const groupKeys = Object.keys(filteredAndGrouped);
              return (
                <Pane key={paneKey} onReorder={setPanes} expanded={false} id={paneKey} onDrop={(_, e) => handleDrop(_, paneKey, e)} onMouseOver={() => selectDriver(paneKey)}>
                  <Pane.Header active={paneKey === selectedDriver} color={colors[paneKey]} type='header' id={paneKey} draggable>
                    {paneKey}
                    <Badge color={isFiltered && filteredByDriver.length ? '#FACF00' : null}>{filteredByDriver.length}</Badge>
                  </Pane.Header> {
                    groupKeys.map(groupKey =>
                      <Group
                        key={groupKey}
                        id={groupKey.split(',')[0]}
                        type={groupBy.split(',')[0]}
                        content={groupKey}
                        onClick={() => handleGroupHeaderClick(groupKey)}
                        flatten={groupKey === 'undefined'}
                        count={filteredAndGrouped[groupKey].length}
                        expanded={isFiltered}
                        filter={filter}
                      >
                        {filteredAndGrouped[groupKey].map(item =>
                          <Group.Item
                            id={item.OrderId}
                            key={item.OrderId}
                            data={item}
                            filter={filter}
                            compact={groupKey !== 'undefined'}
                            active={item.OrderId === selectedMarkerId}
                            // onClick={() => selectMarker(item.OrderId)}
                            onMouseOver={() => selectMarker(item.OrderId)}
                          />)
                        }
                      </Group>
                    )}
                </Pane>
              )
            })
          }
        </Sidebar.Content>
      </Sidebar >
      <GoogleMap
        onClick={() => selectMarker(null)}
        onRightClick={() => setQuickChange(null)}
        cursor={quickChange && circle({ radius: 16, color: colors[quickChange] }).cursor}
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
            cursor: quickChange && circle({ radius: 16, color: colors[quickChange] }).cursor
          }}
        />
        {filteredData.map(({ OrderId: id, GeocodedAddress, Driver }) => {
          if (!GeocodedAddress) return null;
          const driver = Driver || 'UNASSIGNED'
          return <Marker
            key={id}
            id={id}
            opts={{
              draggable: true,
              // label: id,
              position: { lat: GeocodedAddress.latitude, lng: GeocodedAddress.longitude },
              icon: { url: `http://maps.google.com/mapfiles/ms/icons/${colors[driver]}.png` },
              // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
              // icon: labeledIcon({label:id, color: colors[Driver]}),
              cursor: quickChange && circle({ radius: 16, color: colors[quickChange] }).cursor
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
        <ContouredPolygon
          id='polygon'
          points={polygonPoints}
          // color={colors[selectedDriver]}
          color={!paths.find(({ driver }) => driver === selectedDriver) ? colors[selectedDriver] : 'transparent'}
          onClick={() => mapState.map.fitBounds(Bounds.from(polygonPoints))}
        />
        {!isFiltered && paths.map(({ path, driver }) => {
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
