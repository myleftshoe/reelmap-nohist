import React from 'react'
import GoogleMap from './map'
import DepotMarker from './job-markers';
import JobMarkers from './job-markers';
import { InfoWindow } from '@googlemap-react/core';
import MarkerInfoWindowContent from './marker-infowindow-content';
import { colors, drivers } from '../common/constants';
import Routes from './routes';
import CustomControlBar from './custom-control-bar';
import RegionSelectControl from './region-select-control';
import useCursor from '../hooks/useCursor'

function MapMaster({ state, dispatch }) {
    const cursor = useCursor({ shape: state.mapEditMode.tool, color: colors[state.mapEditMode.id], label: '' });
    console.log(state.activeItems)
    return (<GoogleMap
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
    )
}

export default MapMaster;