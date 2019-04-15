import React from 'react'
import { Polygon } from '@googlemap-react/core';

export default function RoutePolygon({ id, path, color, zIndex, ...eventProps }) {
    return <Polygon id={id}
        opts={{
            clickable: true,
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.16,
            strokeWeight: 33, // 33 is the max
            strokePosition: 2, //window.google.maps.StrokePosition.OUTSIDE,
            fillColor: color,
            fillOpacity: 0.16,
            zIndex
        }}
        {...eventProps}
    />
}
