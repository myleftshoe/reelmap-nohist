import React from 'react';
import { CustomControl } from '@googlemap-react/core';
import S from './custom-control-bar-sc';


const CustomControlBar = ({ small, position = 'TOP_LEFT', children }) =>
    <CustomControl bindingPosition={position}>
        <S.ControlBar>{
            React.Children.map(children, child =>
                React.cloneElement(child, { small })
            )}
        </S.ControlBar>
    </CustomControl>

CustomControlBar.IconButton = ({ children: materialIconName, small, ...props }) =>
    small
        ? <S.IconButtonSmall className='material-icons' {...props}>{materialIconName}</S.IconButtonSmall>
        : <S.IconButton className='material-icons' {...props}>{materialIconName}</S.IconButton>

CustomControlBar.TextButton = ({ children: materialIconName, small, ...props }) =>
    small
        ? <S.TextButtonSmall {...props}>{materialIconName}</S.TextButtonSmall>
        : <S.TextButton {...props}>{materialIconName}</S.TextButton>

export default CustomControlBar;