import React from 'react'
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import GoogleMap from './map'
import DepotMarker from './depot-marker';
import JobMarkers from './job-markers';
import Routes from './routes';
import useCursor from '../hooks/useCursor'
import MapControls from './map-controls';
import MarkerInfoWindow from './marker-info-window';
import useToggle from '../hooks/useToggle';


function MapContainer({ state, dispatch }) {

    const drivers = useStore(driverStore);

    const driver = drivers.get(state.mapEditMode.id) || {}
    const color = driver.color || 'blue';

    const cursor = useCursor({ shape: state.mapEditMode.tool, color, label: state.quickChange || '' });

    const [showDetails, toggleShowDetails] = useToggle(false);

    function handleAction(action) {
        switch (action) {
            case 'toggle-show-details': {
                toggleShowDetails();
                break;
            }
            default: { }
        }
    }

    return (
        <GoogleMap
            onClick={dispatch('map-click')}
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
                showLabel={showDetails}
                onMarkerClick={dispatch('marker-click')}
                onMarkerMouseOver={state.setSelectedMarkerId}
            />
            <MapControls state={state} dispatch={dispatch} handleAction={handleAction} />
            {/*
                <ContouredPolygon
                    id='polygon'
                    points={polygonPoints}
                />
                <SuburbBoundary suburb={suburb} />
            */}
            <Routes hidden={state.isFiltered} showPaths={showDetails} routes={state.activeRoutes} />
            {state.selectedMarkerId && <MarkerInfoWindow state={state} dispatch={dispatch} />}

        </GoogleMap>
    )
}

export default MapContainer;