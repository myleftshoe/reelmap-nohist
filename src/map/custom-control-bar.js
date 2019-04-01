import React from 'react';
import { CustomControl } from '@googlemap-react/core';
import S from './custom-control-bar-sc';

const CustomControlBar = ({ position = 'TOP_LEFT', small, children }) => {
    const vertical = position.startsWith('LEFT_') || position.startsWith('RIGHT_');
    return <CustomControl bindingPosition={position}>
        <S.ControlBar vertical={vertical}>{
            React.Children.map(children, child =>
                React.cloneElement(child, { small, vertical })
            )}
        </S.ControlBar>
    </CustomControl>
}

CustomControlBar.IconButton = ({ children: materialIconName, small, ...props }) =>
    small
        ? <S.IconButtonSmall className='material-icons' {...props}>{materialIconName}</S.IconButtonSmall>
        : <S.IconButton className='material-icons' {...props}>{materialIconName}</S.IconButton>

CustomControlBar.TextButton = ({ children: materialIconName, small, ...props }) =>
    small
        ? <S.TextButtonSmall {...props}>{materialIconName}</S.TextButtonSmall>
        : <S.TextButton {...props}>{materialIconName}</S.TextButton>

export default CustomControlBar;