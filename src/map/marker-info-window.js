import React from 'react'
import { InfoWindow } from '@googlemap-react/core';
import MarkerInfoWindowContent from './marker-infowindow-content';
import { colors } from '../common/constants';

function MarkerInfoWindow({ state, dispatch }) {
    return (
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
    )
}

export default MarkerInfoWindow;