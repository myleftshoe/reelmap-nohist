import React from 'react'
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import JobMarker from './job-marker';

const JobMarkers = ({ items = [], selectedMarkerId, cursor, showLabel, onMarkerClick, onMarkerMouseOver }) => {
    const drivers = useStore(driverStore);
    return items.map(({ OrderId: id, GeocodedAddress, Driver, Sequence }) => {
        // if (!GeocodedAddress) return null;
        const label = showLabel ? (Sequence || null) : null;
        const driver = drivers.get(Driver) || {}
        const color = driver.color || 'blue';
        return <JobMarker
            key={id}
            id={id}
            label={label}
            position={GeocodedAddress}
            color={color}
            cursor={cursor}
            big={selectedMarkerId === id}
            onClick={() => onMarkerClick(id)}
        // onMouseOver={() => onMarkerMouseOver(id)}
        />
    })
}
export default JobMarkers;