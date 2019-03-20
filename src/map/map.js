import React, { useEffect, useContext } from 'react'
import { GoogleMapContext, MapBox } from '@googlemap-react/core'
import ThemeSwitcher from './theme-switcher'
import styles from './styles/styles'

export default function Map(props) {
    const { state: { map } } = useContext(GoogleMapContext);
    useEffect(() => map && map.setOptions({ draggableCursor: props.cursor }));
    return <>
        <MapBox
            apiKey={process.env.REACT_APP_GMAPS}
            opts={{
                center: { lat: -37.815018, lng: 144.946014 },
                zoom: 11,
                styles: styles[localStorage.getItem('mapTheme')],
            }}
            // useGeometry
            useGoogleApi
            onClick={props.onClick}
            onRightClick={props.onRightClick}
            LoadingComponent={null}
        />
        <ThemeSwitcher bindingPosition='TOP_LEFT' map={map} />
        {props.children}
    </>
}