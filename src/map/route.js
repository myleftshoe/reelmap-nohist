/* global google */
import React, { useContext } from 'react'
import RoutePolyline from './route-polyline';
import RoutePolygon from './route-polygon';
import { GoogleMapContext } from '@googlemap-react/core'
import { Bounds } from './utils'

export default function Route({ id, path, color, fitBounds = true, ...eventProps }) {
    const { state: { map } } = useContext(GoogleMapContext);
    const points = google.maps.geometry.encoding.decodePath(path)
        .map(point => point.toJSON());
    // console.log(points)
    return <React.Fragment>
        <RoutePolyline
            id={`${id}.polyline`}
            path={points}
            color={color}
        />
        <RoutePolygon
            id={`${id}.polygon`}
            path={points}
            color={color}
            {...eventProps}
            onClick={fitBounds ? () => map.fitBounds(Bounds.from(points)) : eventProps.onClick}
        />
    </React.Fragment>
}