/* global google */

export const Bounds = {
    from(latlngs = []) {
        const bounds = new google.maps.LatLngBounds();
        latlngs.forEach(latlng => bounds.extend(latlng));
        return bounds;
    }
}

// Returns {lat, lng} object from latlng in any of the forms:
// String: "lat,lng"
// Array: [lat, lng]
// Object: {lat, lng}, {lat, lon}, {latitude, longitude}
export function LatLng(latlng) {
    if (!latlng) return null;
    let lat, lng;
    if (Array.isArray(latlng)) {
        [lat, lng] = latlng;
    }
    else if (typeof latlng === 'string') {
        [lat, lng] = latlng.split(',');
    }
    else {
        lat = latlng.lat || latlng.latitude;
        lng = latlng.lng || latlng.lon || latlng.longitude;
    }
    return { lat: parseFloat(lat), lng: parseFloat(lng) }
}
