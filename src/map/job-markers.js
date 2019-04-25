import React from 'react'
import JobMarker from './job-marker';
import { colors } from '../common/constants';

const JobMarkers = ({ items = [], selectedMarkerId, cursor, showLabel, onMarkerClick, onMarkerMouseOver }) => {
    return items.map(({ OrderId: id, GeocodedAddress, Driver, Sequence }) => {
        // if (!GeocodedAddress) return null;
        const label = showLabel ? (Sequence || null) : null;
        const driver = Driver || 'UNASSIGNED'
        return <JobMarker
            key={id}
            id={id}
            label={label}
            position={GeocodedAddress}
            color={colors[driver]}
            cursor={cursor}
            big={selectedMarkerId === id}
            onClick={() => onMarkerClick(id)}
        // onMouseOver={() => onMarkerMouseOver(id)}
        />
    })
}
export default JobMarkers;