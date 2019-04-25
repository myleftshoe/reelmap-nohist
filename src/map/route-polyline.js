import React from 'react'
import { Polyline } from '@googlemap-react/core';

export default function RoutePolyline({ id, path, color }) {
    return <Polyline id={id}
        opts={{
            clickable: true,
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.0,
            strokeWeight: 5, // 33 is the max
            strokePosition: 2, //window.google.maps.StrokePosition.OUTSIDE,
            fillColor: color,
            fillOpacity: 0.0,
        }}
    // onClick={onClick}
    />
}