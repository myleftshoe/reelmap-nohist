import React, { useEffect } from 'react'
import Busy from './components/busy';
import Group from './components/group'
import Filter from './components/filter'
import Minibar from './components/minibar'
import Panes from './components/panes';
import Pane from './components/pane';
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import GoogleMap from './map/map'
import CustomControlBar from './map/custom-control-bar';
import DepotMarker from './map/depot-marker'
import JobMarkers from './map/job-markers'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import RegionSelectControl from './map/region-select-control'
import Routes from './map/routes'
// import { labeledIcon } from './map/markers/markers.js'
// import ContouredPolygon from './map/contoured-polygon'
// import SuburbBoundary from './map/suburb-boundary'
import { InfoWindow } from '@googlemap-react/core'
import { colors, resizableProps, drivers, panes } from './constants'
import useToast from './hooks/useToast'
import useCursor from './hooks/useCursor'
import Solution from './components/solution';
import formattedDuration from './utils/formatted-duration';
import Expandable from './components/expandable';
import { Header } from './components/group.sc';
import TextButton from './components/text-button';
// import TextButton from './components/text-button';

const openInNew = id => window.open(`http://localhost:3006/${id}`)


function App({ state, dispatch }) {
  console.log(state.sidebarContent)
  console.log('rendering', state.solutions);
  useToast(state.currentSolutionId, state.solutions.get(state.currentSolutionId), dispatch('apply-snapshot'));
  const cursor = useCursor({ shape: state.mapEditMode.tool, color: colors[state.mapEditMode.id], label: '' });
  return (
    <Resizable split='vertical' {...resizableProps}>
      <Sidebar>
        <Sidebar.Navigation>
          <Sidebar.NavButton id='City,PostalCode' active={state.groupBy === 'City,PostalCode'} onClick={state.setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
          <Sidebar.NavButton id='PostalCode,City' active={state.groupBy === 'PostalCode,City'} onClick={state.setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
          <Sidebar.NavButton id='OrderId,' active={state.groupBy === 'OrderId,'} onClick={state.setGroupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
          <Sidebar.NavButton id='Sequence,' active={state.groupBy === 'Sequence,'} onClick={dispatch('undo')} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
          <Sidebar.NavButton id='editmode' onClick={dispatch('editmode-click')} tooltip='Auto assign'>scatter_plot</Sidebar.NavButton>
          <Sidebar.NavButton id='autoassign' onClick={dispatch('auto-assign')} tooltip='Auto assign'>timeline</Sidebar.NavButton>
          <Sidebar.NavButton id='clearall' onClick={dispatch('clear-all')} tooltip='Clear all'>clear_all</Sidebar.NavButton>
          {Boolean(state.solutions.size) &&
            <Sidebar.NavButton active={state.sidebarContent === 'history'} id='history' onClick={() => state.setSidebarContent(state.sidebarContent === 'history' ? 'drivers' : 'history')} tooltip='History'>history</Sidebar.NavButton>
          }
          <Busy busy={state.working} />
        </Sidebar.Navigation>
        {state.sidebarContent === 'history' ?
          <Sidebar.Content>
            {state.solutions.size
              ? <Minibar>
                {/* <Minibar.Button title='Clear history' visible onClick={dispatch('clear-history')}>delete_sweep</Minibar.Button> */}
                <TextButton color='#fff7' title='Clear history' visible onClick={dispatch('clear-history')}>Clear all</TextButton>
              </Minibar>
              : <div style={{ display: 'flex', alignSelf: 'center', margin: 32, color: '#fff7' }}>History cleared!</div>
            }
            {
              [...state.solutions.entries()].reverse().map(([key, { summary, routes }], index) => {
                console.log('pane.js', index);
                return <div style={{ backgroundColor: '#0003', margin: '4px 12px 4px 8px', paddingBottom: 8 }}>
                  <Minibar>
                    <Minibar.Button title='Restore' visible onClick={() => dispatch('apply-snapshot')(key)}>restore</Minibar.Button>
                    <Minibar.Button title='Clear history' visible onClick={dispatch('clear-history')}>clear</Minibar.Button>
                  </Minibar>
                  {/* <TextButton style={{ display: 'flex', width: '100%', justifyContent: 'center' }} color='#fff7' onClick={() => dispatch('apply-snapshot')(key)}>Show</TextButton> */}
                  <Expandable key={'totals'} expanded={false} content={
                    <Solution id={key} distance={summary.distance} duration={summary.duration} service={summary.service} onButtonClick={dispatch('apply-snapshot')} />
                  } >
                    {routes.map(route => <>
                      <Header id={route.vehicle}>
                        <div>{drivers[route.vehicle]}</div>
                        <div>{formattedDuration(route.duration + route.service)}</div>
                      </Header>
                      <Solution distance={route.distance} duration={route.duration} service={route.service} onButtonClick={dispatch('apply-snapshot')} />
                    </>
                    )}
                  </Expandable>
                </div>
              })
            }
          </Sidebar.Content>
          : <Sidebar.Content>
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
              onDrop={dispatch('drop')}
              onMaximizeEnd={dispatch('maximize-end')}
              onOpenInNew={openInNew}
            >
              {items => {
                // const groupedItems = groupBy2(items, state.groupBy);
                const groupedItems = dispatch('group-items')({ items, by: state.groupBy });
                const groupKeys = Object.keys(groupedItems);
                return groupKeys.map(groupKey =>
                  <Group
                    key={groupKey}
                    id={groupKey.split(',')[0]}
                    type={state.groupBy.split(',')[0]}
                    items={groupedItems[groupKey]}
                    content={groupKey}
                    // onHeaderClick={dispatch('GroupHeaderClick')}
                    onItemClick={state.setSelectedMarkerId}
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
        }
      </Sidebar >
      <GoogleMap
        onClick={() => state.setSelectedMarkerId(null)}
        onRightClick={dispatch('map-rightclick')}
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
          onMarkerClick={dispatch('marker-click')}
          onMarkerRightClick={dispatch('marker-rightclick')}
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
              onDriverChange={dispatch('reassign-item')}
              dropDownValues={colors}
            />
          </InfoWindow>
        }
        {/* <ContouredPolygon
          id='polygon'
          points={polygonPoints}
        /> */}
        <Routes hidden={state.isFiltered} paths={state.activePaths} onRightClick={dispatch('reassign-route')} />
        {/* <SuburbBoundary suburb={suburb} /> */}
        {state.mapEditMode.on &&
          <CustomControlBar small>
            <CustomControlBar.Select onSelectionChanged={dispatch('selection-change')}>
              {drivers.map(driver =>
                <CustomControlBar.IconButton key={driver} id={driver} title={driver} color={colors[driver]}>fiber_manual_record</CustomControlBar.IconButton>
              )}
            </CustomControlBar.Select>
            <RegionSelectControl
              id='regionSelectTool'
              title='Region select tool'
              hidden
              active={state.mapEditMode.tool === 'rectangle'}
              onSelectionComplete={dispatch('selection-complete')}
              clearOnComplete
              color={colors[state.mapEditMode.id]}
            />
          </CustomControlBar>
        }
      </GoogleMap>
    </Resizable >
  )
}

export default App;
