import React, { useContext } from 'react'
import { GoogleMapContext, MapBox } from '@googlemap-react/core'
import ThemeSwitcher from './theme-switcher'
import styles from './styles/styles'

export default function Map(props) {
    const { state: { map } } = useContext(GoogleMapContext);

    console.log('Rendering map')

    return <>
        <MapBox
            apiKey={process.env.REACT_APP_GMAPS}
            opts={{
                center: { lat: -37.815018, lng: 144.946014 },
                zoom: 11,
                styles: styles[localStorage.getItem('mapTheme')],
                draggableCursor: props.cursor,
                mapTypeControl : false
            }}
            useDrawing
            useGeometry
            useGoogleApi
            onClick={props.onClick}
            onRightClick={props.onRightClick}
            LoadingComponent={null}
        />
        {/* <ThemeSwitcher bindingPosition='TOP_LEFT' map={map} /> */}
        {props.children}
    </>
}