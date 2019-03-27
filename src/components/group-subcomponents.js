import React from 'react'
import styled from '@emotion/styled'
import Highlight from 'react-highlighter'
import Badge from './badge'

export const SearchHighlight = props =>
    <Highlight matchStyle={{ backgroundColor: '#FACF00' }} {...props}>
        {props.children}
    </Highlight>

export const CustomTable = styled.table`
    border-collapse: separate;
    border-spacing: 0 8px;
`

export const Table = props => <CustomTable><tbody>{props.children}</tbody></CustomTable>

export const Row = styled.tr`
    padding-left: 8px;
    &:hover { background-color: #7773; };
    background-color: ${props => props.draggingOver ? '#0003' : '#f0f0'};
    transition: background-color 200ms ease;
`

export const Header = styled.span`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding: 0 12px 0 12px;
    line-height: 2.0rem;
    font-size: 0.6rem;
    color: #aaaa;
    max-width: 800px;
    text-transform: uppercase;
    /* max-width:312px; */
    &:hover { background-color: #7773; };
`

export const Address = styled.td`
    padding-left: 12px;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: #f0f0;
    font-size: 0.8rem;
    /* box-shadow: ${props => props.draggingOver ? '0px -1px 0px 0px #FC5185' : '0px 0px 0px 0px #FC5185'}; */
    min-width: ${props => props.minWidth};
    /* &:hover {
        box-shadow: ${props => props.draggingOver && '0px -1px 0px 0px #FC5185'};
    }; */
    transition: box-shadow 0.2s ease 0.2s;
`

export const Street = styled.div`
    pointer-events: none;
`

export const CityWithPostCode = styled.div`
    pointer-events: none;
    font-size: 0.6rem;
    color: #aaaa;
    text-transform: uppercase;
`

export const NumericTd = styled.td`
    pointer-events: none;
    min-width: 4ch;
`

export const Numeric = ({ children }) =>
    <NumericTd>
        <Badge>
            {children}
        </Badge>
    </NumericTd>

export const Notes = styled.td`
    pointer-events: none;
    min-width: ${props => props.minWidth}px;
    max-width: 25vw;
    font-size: 0.6rem;
    color: #aaaa;
    text-transform: uppercase;
`

// background-color: ${(selected || active) && '#7773'};
