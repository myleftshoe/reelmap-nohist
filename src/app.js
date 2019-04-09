import React from 'react'
import Busy from './components/busy';
import Resizable from './components/resizable'
import Sidebar from './components/sidebar'
import GoogleMap from './map/map'
import CustomControlBar from './map/custom-control-bar';
import DepotMarker from './map/depot-marker'
import JobMarkers from './map/job-markers'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import RegionSelectControl from './map/region-select-control'
import Routes from './map/routes'
import { InfoWindow } from '@googlemap-react/core'
import { colors, resizableProps, drivers, panes } from './constants'
import useToast from './hooks/useToast'
import useCursor from './hooks/useCursor'
import ToastSidebar from './components/toast-sidebar';
import DriverSidebar from './components/driver-sidebar';

const openInNew = id => window.open(`http://localhost:3006/${id}`)


function App({ state, dispatch }) {

  // console.log('rendering', state.toasts);

  useToast(state.toast);
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
          <Sidebar.NavButton id='history' active={state.activeSidebar === 'history'}  onClick={() => state.setActiveSidebar(state.activeSidebar === 'history' ? 'drivers' : 'history')} tooltip='History' badge={{ count: state.solutions.size, color: '#facf00' }}>history</Sidebar.NavButton>
          <Busy busy={state.working} />
        </Sidebar.Navigation>
        {state.activeSidebar === 'history'
          ? <ToastSidebar />
          : <DriverSidebar state={state} dispatch={dispatch} panes={panes} />
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
