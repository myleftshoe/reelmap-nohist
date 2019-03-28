import React from 'react'
import styled from '@emotion/styled';

export const Minibar = styled.div`
    /* opacity:1; */
    display:flex;
    justify-content:flex-end;
    align-items:center;
    /* &:hover {
        opacity:1;
    }; */
`

const MinibarButton = styled.span`
    padding: 6px 6px;
    font-size: 14px;
    color:#FFF;
    /* opacity: ${props => props.visible ? 0.5 : 0}; */
    opacity:0.5;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    transition:opacity 0.1s linear 0.3s;
    :hover {
        opacity: 1;
        cursor: pointer;
    };
`

Minibar.Button = props => {
    function onClick(e) {
        e.stopPropagation();
        props.onClick && props.onClick(props.id);
    }
    const icon = props.children;
    return <MinibarButton visible={props.visible} onClick={onClick}>
        <i className="material-icons" style={{ fontSize: '16px' }}>{icon}</i>
    </MinibarButton >
}

export default Minibar;
