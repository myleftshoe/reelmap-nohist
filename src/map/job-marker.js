/* global google */
import React from 'react'
import { Marker } from "@googlemap-react/core";
import { LatLng } from './utils';

export default function JobMarker({ id, label, position, color, cursor, ...eventProps }) {
    return <Marker
        key={id}
        id={id}
        opts={{
            draggable: true,
            // label: `${Sequence}`,
            label: label && {
                text: `${label}`,
                color: 'black',
                fontSize: '10px',
                fontWeight: 'bold',
            },
            position: LatLng(position),
            icon: {
                url: `http://maps.google.com/mapfiles/ms/icons/${color}.png`,
                labelOrigin: window.google && new google.maps.Point(15, 10)
            },
            // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
            // icon: labeledIcon({label:id, color: colors[Driver]}),
            cursor
        }}
        {...eventProps}
    />
}