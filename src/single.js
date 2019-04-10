/* global google */
import React, { useState } from 'react'
import { css } from '@emotion/core';
import { useStore } from 'outstated'
import dataStore from './stores/mock-data-store'
import Minibar from './components/minibar'
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import Panes from './panes/panes'
import Group from './group/group'
import Filter from './components/filter'
import GoogleMap from './map/map'
import { InfoWindow, Marker, Polyline } from '@googlemap-react/core'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import { circle } from './svg/cursors'
import { colors, resizableProps } from './constants'
import vroom from './map/services/vroom2'
import { BeatLoader } from 'react-spinners';
import collect from 'collect.js';
import groupBy2 from './utils/groupby2';

function Single(props) {

  const [store, updateStore, persist] = useStore(dataStore)
  const [selectedMarkerId, selectMarker] = useState();
  const [selectedDriver, selectDriver] = useState();
  const [quickChange, setQuickChange] = useState();
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('PostalCode,City');
  const [path, setPath] = useState();
  const [busy, setBusy] = useState(false);

  const driver = props.match.params.id;
  const pane = driver;

  const items = collect([...store.values()]).where('Driver', driver).sortBy(sortBy).all();
  // const items = [...store.values()].filter(({ Driver }) => Driver === driver);

  const filteredItems = Filter.apply(items, ['OrderId', 'Street', 'PostalCode', 'City', 'DeliveryNotes']);
  const isFiltered = Boolean(filter && filteredItems.length)
  const selectedItem = store.get(selectedMarkerId);
  const cursor = quickChange ? circle({ radius: 10, color: colors[quickChange], text: quickChange }).cursor : null

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


  async function optimize() {
    setBusy(true);
    const { paths, newItems } = await vroom(items, [driver]);
    console.log(paths)
    // console.log(paths[0].path)
    setPath(paths.get(driver).path);
    updateStore();
    setBusy(false);
  }

  function clear() {
    items.forEach(item => item.Sequence = '');
    setPath(null)
    updateStore()
  }

  function reverse() {
    items.reverse();
    updateStore()
  }


  const points = (window.google && path && google.maps.geometry.encoding.decodePath(path).map(point => point.toJSON())) || [];

  return (
    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          <Sidebar.NavButton id='City' active={sortBy === 'City'} onClick={setSortBy} tooltip='Sort by suburb'>location_city</Sidebar.NavButton>
          {/* <Sidebar.NavButton active={groupBy === 'Driver'} onClick={() => setSortBy('Driver')}>people</Sidebar.NavButton> */}
          <Sidebar.NavButton id='PostalCode' active={sortBy === 'PostalCode'} onClick={setSortBy} tooltip='Sort by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence' active={sortBy === 'Sequence'} onClick={setSortBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='optimize' onClick={optimize} tooltip='Optimize route'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='reverse' onClick={reverse} tooltip='Reverse route'>swap_vert</Sidebar.NavButton>
          <Sidebar.NavButton id='clear' onClick={clear} tooltip='Clear all'>clear_all</Sidebar.NavButton>
          {/* <Sidebar.NavButton id='avoidtolls' onClick={clearAll} tooltip='Avoid tolls'>toll</Sidebar.NavButton> */}
          <BeatLoader
            css={css`margin-top: auto;`}
            sizeUnit='px'
            size={6}
            color={'#FFF'}
            loading={busy}
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
            panes={[pane]}
            groupBy={'Driver'}
            data={filteredItems}
            isFiltered={isFiltered}
            // onDrop={handleDrop}
            onMaximizeEnd={selectDriver}
          >
            {items => {
              const groupedItems = groupBy2(items, sortBy);
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
                    // onDrop={handleItemDrop}
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
        <Marker
          key={'depot'}
          id={'depot'}
          opts={{
            position: { lat: -37.688797, lng: 145.005252 },
            icon: { url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
            cursor
          }}
        />
        {filteredItems.map(({ OrderId: id, GeocodedAddress, Sequence }) => {
          if (!GeocodedAddress) return null;
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
                labelOrigin: { x: 15, y: 10 }
              },
              cursor
            }}
            onClick={() => selectMarker(id)}
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
          {selectedMarkerId && <MarkerInfoWindowContent item={selectedItem} color={colors[selectedItem.Driver]} />}
        </InfoWindow>
        <React.Fragment key={'path' + driver}>
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
          />
        </React.Fragment>
      </GoogleMap>
    </Resizable >

  );
}


export default Single;
