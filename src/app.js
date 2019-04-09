import React from 'react'
import Resizable from './components/resizable'
import GoogleMap from './map/map'
import CustomControlBar from './map/custom-control-bar';
import DepotMarker from './map/depot-marker'
import JobMarkers from './map/job-markers'
import MarkerInfoWindowContent from './map/marker-infowindow-content'
import RegionSelectControl from './map/region-select-control'
import Routes from './map/routes'
import { InfoWindow } from '@googlemap-react/core'
import { colors, resizableProps, drivers } from './constants'
import useToast from './hooks/useToast'
import useCursor from './hooks/useCursor'
import Sidebars from './components/sidebars';

const openInNew = id => window.open(`http://localhost:3006/${id}`)


function App({ state, dispatch }) {

  // console.log('rendering', state.toasts);

  useToast(state.toast);
  const cursor = useCursor({ shape: state.mapEditMode.tool, color: colors[state.mapEditMode.id], label: '' });

  return (
    <Resizable split='vertical' {...resizableProps}>
      <Sidebars state={state} dispatch={dispatch} />
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
