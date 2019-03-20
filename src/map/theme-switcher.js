import React from 'react';
import { CustomControl } from '@googlemap-react/core'
import styles from './styles/styles';
import useLoop from '../hooks/useLoop';
import CustomControlBar from './custom-control-bar';

export default function ThemeSwitcher({ map }) {
    const nextKey = useLoop([...Object.keys(styles), null], localStorage.getItem('mapTheme'));
    const switchTheme = () => {
        const themeName = nextKey();
        map.setOptions({ styles: styles[themeName] })
        localStorage.setItem('mapTheme', themeName);
    }
    return <CustomControl bindingPosition='TOP_LEFT'>
        <CustomControlBar>
            <CustomControlBar.IconButton onClick={switchTheme}>invert_colors</CustomControlBar.IconButton>
            {/* <CustomControlBar.Divider/> */}
            {/* <CustomControlBar.TextButton onClick={switchTheme}>Satellite</CustomControlBar.TextButton> */}
        </CustomControlBar>
    </CustomControl>
}
