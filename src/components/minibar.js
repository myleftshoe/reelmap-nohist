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

const StyledMinibarButton = styled.span`
    padding: 6px 6px;
    color: ${props => props.active ? 'white' : 'gray'};
    &:hover {
        color:white;
        cursor:pointer;
    };
`

Minibar.Button = props => {
    function onClick(e) {
        e.stopPropagation();
        props.onClick && props.onClick();
    }
    const icon = props.children;
    return <StyledMinibarButton active={props.active} onClick={onClick}>
        <i className="material-icons" style={{ fontSize: '16px' }}>{icon}</i>
    </StyledMinibarButton >
}

export default Minibar;
