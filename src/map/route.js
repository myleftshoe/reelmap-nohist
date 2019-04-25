/* global google */
import React, { useContext, useMemo } from 'react'
import RoutePolyline from './route-polyline';
import RoutePolygon from './route-polygon';
import { GoogleMapContext } from '@googlemap-react/core'
import { Bounds } from './utils'

export default function Route({ id, path, color, fitBounds = true, showPath, ...eventProps }) {
    if (!window.google) return null;
    const mapContext = useContext(GoogleMapContext);
    const { map } = mapContext.state;
    const points = useMemo(() => google.maps.geometry.encoding.decodePath(path), [path]);
    const area = google.maps.geometry.spherical.computeArea(points);
    const zIndex = -Math.trunc(area / 1000);
    return <>
        <RoutePolyline
            id={`${id}.polyline`}
            path={points}
            color={showPath ? color : 'transparent'}
        />
        <RoutePolygon
            id={`${id}.polygon`}
            path={points}
            color={color}
            {...eventProps}
            onClick={fitBounds ? () => map.fitBounds(Bounds.from(points)) : eventProps.onClick}
            zIndex={zIndex}
        />
    </>
}