import React from 'react'
import { Marker } from "@googlemap-react/core";
import { LatLng } from './utils';

export default function DepoMarker({ id, position, color, cursor, ...eventProps }) {
    return <Marker
        key={id}
        id={id}
        opts={{
            draggable: true,
            // label: id,
            position: LatLng(position),
            icon: {
                // url: `https://cdn.iconscout.com/icon/premium/png-256-thumb/map-pin-121-864982.png`,
                url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                // scaledSize: window.google && new google.maps.Size(40, 40)
            },
            // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
            // icon: labeledIcon({label:id, color: colors[Driver]}),
            cursor
        }}
    />
}