import React from 'react';
import styles from './styles/styles';
import useLoop from '../hooks/useLoop';
import CustomControlBar from './custom-control-bar';

export default function ThemeSwitcher({ map, position }) {
    const nextKey = useLoop([...Object.keys(styles), null], localStorage.getItem('mapTheme'));
    function switchTheme() {
        const themeName = nextKey();
        map.setOptions({ styles: styles[themeName] })
        localStorage.setItem('mapTheme', themeName);
    }
    return <CustomControlBar small position={position}>
        <CustomControlBar.IconButton onClick={switchTheme}>invert_colors</CustomControlBar.IconButton>
        {/* <CustomControlBar.Divider/> */}
        {/* <CustomControlBar.TextButton onClick={switchTheme}>Satellite</CustomControlBar.TextButton> */}
    </CustomControlBar>
}
