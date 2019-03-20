/* global google */
import React from 'react'
import { Polygon } from '@googlemap-react/core';
import hull from 'hull.js';

export let polygon

export default function ContouredPolygon({ id, points = [], onClick, color, opacity = 0.25 }) {

    let latlngs = hull(points, 0.1, ['.lat', '.lng']) // returns points of the hull (in clockwise order)

    if (latlngs.length === 1) {
        latlngs = [...latlngs, ...latlngs];
    }

    if (window.google) {
        polygon = new google.maps.Polygon({ paths: latlngs })
        polygon.contains = latlng => google.maps.geometry.poly.containsLocation(latlng, polygon)
    }

    return <Polygon id={id}
        opts={{
            clickable: true,
            path: latlngs,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: opacity,
            strokeWeight: 33, // 33 is the max
            strokePosition: 2, //window.google.maps.StrokePosition.OUTSIDE,
            fillColor: color,
            fillOpacity: opacity,
        }}
        onClick={onClick}
    />
}