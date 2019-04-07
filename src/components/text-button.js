import React from 'react'
import styled from '@emotion/styled'

const StyledTextButton = styled.button`
    font-size: 0.7rem;
    padding: 4px 8px 4px 2px;
    margin: 4px 4px 0px 0px;
    color:${props => props.color};
    /* background-color: ${props => props.active && props.color}; */
    background-color: transparent;
    opacity: ${props => props.active && 0.8};
    text-align: center;
    text-transform: uppercase;
    border: none;
    outline: none;
    &:hover {
        color:black;
        cursor:pointer;
    };
`

export default function TextButton(props) {

    return <StyledTextButton {...props}
    //     active={props.active}
    //     color={props.color}
    //     onClick={props.onClick}
    >
        {props.children}
    </StyledTextButton >
}
