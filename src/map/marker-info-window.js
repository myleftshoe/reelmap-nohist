import React from 'react'
import { InfoWindow } from '@googlemap-react/core';
import MarkerInfoWindowContent from './marker-infowindow-content';
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'

function MarkerInfoWindow({ state, dispatch }) {
    const drivers = useStore(driverStore);
    const color = drivers.get(state.selectedItem.Driver);
    return (
        <InfoWindow
            anchorId={state.selectedMarkerId}
            visible={state.selectedMarkerId}
            onCloseClick={() => state.setSelectedMarkerId(null)}
            opts={{ disableAutoPan: true }}
        >
            <MarkerInfoWindowContent
                item={state.selectedItem}
                color={color}
                onDriverChange={dispatch('reassign-item')}
                dropDownValues={[]}
            // dropDownValues={colors}
            />
        </InfoWindow>
    )
}

export default MarkerInfoWindow;