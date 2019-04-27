import React from 'react'
import { Marker } from "@googlemap-react/core";
import { LatLng } from './utils';

export default function DepotMarker({ id, position, color, cursor, ...eventProps }) {
    return <Marker
        key={id}
        id={id}
        opts={{
            draggable: true,
            // label: id,
            position: LatLng(position),
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                // scaledSize: window.google && new google.maps.Size(40, 40)
            },
            cursor
        }}
    />
}