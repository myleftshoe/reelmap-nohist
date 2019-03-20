import React from 'react';
import styled from '@emotion/styled'

const CustomControlBar = styled.div`
    overflow:hidden;
    background-color:#FFF;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    margin:10px;
    filter: drop-shadow(0px 1px 1px #00000028);
    border-radius:2px;
    cursor:pointer;
`

CustomControlBar.IconButton = ({children:materialIconName, ...props}) =>
    <CustomControlBarIconButton className='material-icons' style={{fontSize:'20px'}} {...props}>{materialIconName}</CustomControlBarIconButton>

const CustomControlBarIconButton = styled.i`
    padding:8px;
    opacity:0.66;
    min-width:24px;
    height:24px;
    display:flex;
    align-items:center;
    justify-content: center;
    :hover {
        opacity:1;
        background-color:#00000015;
    };
    border-left: 1px solid #00000015;
    :first-child {
        border-left: none;
    }
`

CustomControlBar.Divider=styled.div`
    height:40px;
    width:1px;
    background-color:#00000015;
`

CustomControlBar.TextButton = styled.div`
    font-size:18px;
    padding:8px 17px;
    opacity:0.66;
    min-width:24px;
    height:24px;
    display:flex;
    align-items:center;
    justify-content: center;
    :hover {
        opacity:1;
        background-color:#00000015;
    };
    border-left: 1px solid #00000015;
    :first-child {
        border-left: none;
    }
`

export default CustomControlBar;