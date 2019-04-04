import React from 'react'
import StateProvider from './state-provider';
import Busy from './components/busy';
import Group from './components/group'
import Filter from './components/filter'
import Minibar from './components/minibar'
import Panes from './components/panes';
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import GoogleMap from './map/map'
import CustomControlBar from './map/custom-control-bar';
import DepotMarker from './map/depot-marker'
import JobMarkers from './map/job-markers';
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import RegionSelectControl from './map/region-select-control';
import Routes from './map/routes';
// import { labeledIcon } from './map/markers/markers.js'
// import ContouredPolygon from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import { InfoWindow } from '@googlemap-react/core'
import { colors, resizableProps, drivers, panes } from './constants'
import { circle } from './svg/cursors'
import { groupBy2 } from './utils/utils'


const openInNew = id => window.open(`http://localhost:3006/${id}`)

function App(props) {
  console.log('rendering');
  return (
    <StateProvider>{([state, dispatch]) => {
      const cursor = state.mapEditMode.tool ? circle({ radius: 10, color: colors[state.mapEditMode.id], text: state.quickChange }).cursor : null;
      return (
        <Resizable split='vertical' {...resizableProps}>
          <Sidebar>
            <Sidebar.Navigation>
              <Sidebar.NavButton id='City,PostalCode' active={state.groupBy === 'City,PostalCode'} onClick={state.setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
              <Sidebar.NavButton id='PostalCode,City' active={state.groupBy === 'PostalCode,City'} onClick={state.setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
              <Sidebar.NavButton id='OrderId,' active={state.groupBy === 'OrderId,'} onClick={state.setGroupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
              <Sidebar.NavButton id='Sequence,' active={state.groupBy === 'Sequence,'} onClick={state.setGroupBy} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
              <Sidebar.NavButton id='editmode' onClick={dispatch('EditModeClick')} tooltip='Auto assign'>scatter_plot</Sidebar.NavButton>
              <Sidebar.NavButton id='autoassign' onClick={dispatch('autoAssign')} tooltip='Auto assign'>timeline</Sidebar.NavButton>
              <Sidebar.NavButton id='clearall' onClick={dispatch('clearAll')} tooltip='Clear all'>clear_all</Sidebar.NavButton>
              <Busy busy={state.working} />
            </Sidebar.Navigation>
            <Sidebar.Content>
              <Minibar>
                <Filter onChange={state.setFilter} />
                {/* <Minibar.Button onClick={() => setSortBy('City,PostalCode')}>location_city</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy('PostalCode,City')}>local_post_office</Minibar.Button>
            <Minibar.Button onClick={() => setSortBy([])}>format_list_numbered</Minibar.Button> */}
              </Minibar>
              <Panes
                panes={panes}
                groupBy={'Driver'}
                items={state.filteredItems}
                isFiltered={state.isFiltered}
                onDrop={dispatch('Drop')}
                onMaximizeEnd={dispatch('MaximizeEnd')}
                onOpenInNew={openInNew}
              >
                {items => {
                  const groupedItems = groupBy2(items, state.groupBy);
                  const groupKeys = Object.keys(groupedItems);
                  return groupKeys.map(groupKey =>
                    <Group
                      key={groupKey}
                      id={groupKey.split(',')[0]}
                      type={state.groupBy.split(',')[0]}
                      items={groupedItems[groupKey]}
                      content={groupKey}
                      // onHeaderClick={dispatch('GroupHeaderClick')}
                      onItemClick={state.setSelectMarker}
                      activeItemId={state.selectedMarkerId}
                      flatten={groupKey === 'undefined'}
                      count={groupedItems[groupKey].length}
                      expanded={state.isFiltered}
                      filter={state.filter}
                    />
                  )
                }}
              </Panes>
            </Sidebar.Content>
          </Sidebar >
          <GoogleMap
            onClick={() => state.setSelectedMarkerId(null)}
            onRightClick={dispatch('MapRightClick')}
            cursor={cursor}
          >
            <DepotMarker
              id={'depot'}
              position={{ lat: -37.688797, lng: 145.005252 }}
              cursor={cursor}
            />
            <JobMarkers
              items={state.activeItems}
              selectedMarkerId={state.selectedMarkerId}
              cursor={cursor}
              showLabel={!state.mapEditMode.on}
              onMarkerClick={dispatch('MarkerClick')}
              onMarkerRightClick={dispatch('MarkerRightClick')}
              onMarkerMouseOver={state.setSelectedMarkerId}
            />
            {state.selectedMarkerId &&
              <InfoWindow
                anchorId={state.selectedMarkerId}
                visible={state.selectedMarkerId}
                onCloseClick={() => state.setSelectedMarkerId(null)}
                opts={{ disableAutoPan: true }}
              >
                <MarkerInfoWindowContent
                  item={state.selectedItem}
                  color={colors[state.selectedItem.Driver]}
                  onDriverChange={dispatch('reassignItem')}
                  dropDownValues={colors}
                />
              </InfoWindow>
            }
            {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
        /> */}
            <Routes hidden={state.isFiltered} paths={state.activePaths} onRightClick={dispatch('reassignRoute')} />
            {/* <SuburbBoundary suburb={suburb} /> */}
            {state.mapEditMode.on &&
              <CustomControlBar small>
                <CustomControlBar.Select onSelectionChanged={dispatch('SelectionChange')}>
                  {drivers.map(driver =>
                    <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>fiber_manual_record</CustomControlBar.IconButton>
                  )}
                </CustomControlBar.Select>
                <RegionSelectControl
                  id='regionSelectTool'
                  title='Region select tool'
                  hidden
                  active={state.mapEditMode.tool === 'rectangle'}
                  onSelectionComplete={dispatch('SelectionComplete')}
                  clearOnComplete
                  color={colors[state.mapEditMode.id]}
                />
              </CustomControlBar>
            }
          </GoogleMap>
        </Resizable >
      )
    }}
    </StateProvider>
  )
}

export default App;
