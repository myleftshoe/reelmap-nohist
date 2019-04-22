import React from 'react'
import GoogleMap from './map'
import DepotMarker from './depot-marker';
import JobMarkers from './job-markers';
import { colors } from '../common/constants';
import Routes from './routes';
import useCursor from '../hooks/useCursor'
import MapControls from './map-controls';
import MarkerInfoWindow from './marker-info-window';


function MapContainer({ state, dispatch }) {
    const cursor = useCursor({ shape: state.mapEditMode.tool, color: colors[state.mapEditMode.id], label: state.quickChange || '' });
    console.log(state.activeItems, state.activeRoutes)
    return (
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
                showLabel={true}
                onMarkerClick={dispatch('marker-click')}
                onMarkerRightClick={dispatch('marker-rightclick')}
                onMarkerMouseOver={state.setSelectedMarkerId}
            />
            <MapControls state={state} dispatch={dispatch} />
            {/*
                <ContouredPolygon
                    id='polygon'
                    points={polygonPoints}
                />
                <SuburbBoundary suburb={suburb} />
            */}
            {state.selectedMarkerId && <MarkerInfoWindow state={state} dispatch={dispatch} />}
            {state.showPaths && <Routes hidden={state.isFiltered} routes={state.activeRoutes} onRightClick={dispatch('reverse-route')} />}

        </GoogleMap>
    )
}

export default MapContainer;