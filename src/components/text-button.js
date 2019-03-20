import React from 'react'
import styled from '@emotion/styled'

const StyledTextButton = styled.button`
    font-size: 0.7rem;
    padding: 4px 8px 4px 2px;
    margin: 4px 4px 0px 0px;
    /* background-color: ${props => props.active && props.color}; */
    background-color: transparent;
    opacity: ${props => props.active && 0.8};
    text-align: center;
    text-transform: uppercase;
    border: none;
    &::before {
        content: '⬤ ';
        color:${props => props.color}
    }
    /* border-bottom: ${props => props.active && '2px solid'}; */
    color: ${props => props.active ? 'white' : 'gray'};
    &:hover {
        color:black;
        cursor:pointer;
    };
`

export default function TextButton(props) {

    return <StyledTextButton
        active={props.active}
        color={props.color}
        onClick={props.onClick}
    >
        {props.children}
    </StyledTextButton >
}
