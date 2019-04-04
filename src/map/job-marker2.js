import React from 'react'
import { Marker } from "@googlemap-react/core";
import { LatLng } from './utils';




function markerPath(width, height, offset, radius) {
    const left = -width / 2
    const right = width / 2
    const top = -offset - height
    const bottom = -offset
    return `M 0,0
      L ${-offset},${bottom}
      H ${left + radius}
      Q ${left},${bottom} ${left},${bottom - radius}
      V ${top + radius}
      Q ${left},${top} ${left + radius},${top}
      H ${right - radius}
      Q ${right},${top} ${right},${top + radius}
      V ${bottom - radius}
      Q ${right},${bottom} ${right - radius},${bottom}
      H ${offset}
      L 0,0 z`
}

export default function JobMarker({ id, label, position, color, cursor, ...eventProps }) {
    var symbolOne = {
        path: markerPath(20, 13, 4, 3),
        strokeWeight: 2,
        strokeColor: '#000',
        fillColor: color,
        fillOpacity: 1,
        labelOrigin: { x: 0, y: -10 }
    };
    return <Marker
        key={id}
        id={id}
        opts={{
            draggable: true,
            // label: label,
            // label: `${Sequence}`,
            label: label && {
                text: `${label}`,
                color: '#000',
                fontSize: '9px',
                fontWeight: 'bold',
            },
            position: LatLng(position),
            // icon: {
            //     url: `http://maps.google.com/mapfiles/ms/icons/${color}.png`,
            //     labelOrigin: { x: 16, y: 10 }
            // },
            icon: symbolOne,
            // icon: { url: `http://labs.google.com/ridefinder/images/mm_20_${colors[driver]}.png` },
            // icon: labeledIcon({label:id, color: colors[Driver]}),
            cursor
        }}
        {...eventProps}
    />
}