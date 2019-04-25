import React, { useContext, useEffect } from 'react'
import { GoogleMapContext, MapBox } from '@googlemap-react/core'
import ThemeSwitcher from './theme-switcher'
import styles from './styles/styles'

export default function Map(props) {
    const { state: { map } } = useContext(GoogleMapContext);
    const theme = styles[localStorage.getItem('mapTheme')];

    // stops map panning back to initial zoom and center when opts change in MapBox component
    useEffect(() => map && map.setOptions({ draggableCursor: props.cursor }), [map, props.cursor]);
    useEffect(() => map && map.setOptions({ styles: theme }), [map, theme]);

    function handleClick() {
        props.onClick && props.onClick(map);
    }
    console.log('Rendering map')

    return <>
        <MapBox
            apiKey={process.env.REACT_APP_GMAPS}
            opts={{
                center: { lat: -37.815018, lng: 144.946014 },
                zoom: 11,
                // styles: styles[localStorage.getItem('mapTheme')],
                // draggableCursor: props.cursor,
                mapTypeControl: false
            }}
            useDrawing
            useGeometry
            useGoogleApi
            onClick={handleClick}
            onRightClick={props.onRightClick}
            LoadingComponent={null}
        />
        <ThemeSwitcher position='LEFT_BOTTOM' map={map} />
        {props.children}
    </>
}