/* global google */

async function paidGeocode(address) {
    const geocoder = new google.maps.Geocoder();
    // let data = await geocoder.geocode({'location': latlng});
    return new Promise(function (resolve, reject) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                resolve({ lat: location.lat(), lng: location.lng() });
            }
            else {
                reject(status);
            }
        });
    })
}

// streetview api calls are free -> using instead of geocoding api
// Wanted to use StreetViewService.getPanorama() but it only accepts
// latlng as param, not address unlike the metadata api call below
export async function geocode(address) {
    const API_KEY = `&key=${process.env.REACT_APP_GMAPS}`;
    const endPoint = "https://maps.googleapis.com/maps/api/streetview/metadata?";
    const encodedAddress = "location=" + encodeURIComponent(address);
    const requestUrl = endPoint + encodedAddress + API_KEY;

    const response = await fetch(requestUrl);
    const json = await response.json();

    let location = json.location;
    if (!location) {
        console.warn("Using paid geocoder for", address);
        location = await paidGeocode(address);
    }
    return location;
}

export async function reverseGeocode(latlng) {
    const geocoder = new google.maps.Geocoder();
    // let data = await geocoder.geocode({'location': latlng});
    return new Promise(function (resolve, reject) {
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                resolve(results[0].formatted_address)
            }
            else {
                reject(status);
            }
        });
    })
}

export async function reverseGeocodeSV(location) {
    // location: {lat:, lng:}
    const sv = new google.maps.StreetViewService();
    return new Promise((resolve, reject) => {
        sv.getPanorama({ location }, (data, status) => {
            console.log(data, status);
            const address = data.location.description;
            resolve(address);
        })
    });
}

// export async function reverseGeocodeMapQuest(latlng) {
//     const REVERSEGEOCODEURL = "http://www.mapquestapi.com/geocoding/v1/reverse?";
//     const MAPQUESTKEY = process.env.REACT_APP_MAPQUEST;
//     const { latitude, longitude } = latlng;
//     let url = REVERSEGEOCODEURL + `key=${MAPQUESTKEY}&location=${latitude},${longitude}`;
//     let response = await fetch(encodeURI(url));
//     let data = await response.json();
//     console.log("reverseGeocode", data.results[0].locations[0]);
// }
