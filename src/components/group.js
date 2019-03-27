/** @jsx jsx */
// import React from 'react';
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'
import Highlight from 'react-highlighter'
import Badge from './badge'
import Expandable from "./expandable";
import useToggle from '../hooks/useToggle';
import { useState } from 'react';
import usePrevious from '../hooks/usePrevious';

const minWidth = 300;

const StyledHeader = styled.span`
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
const Group = props => !props.flatten
    ? <Expandable
        key={props.id}
        onClick={props.onClick}
        content={
            <StyledHeader draggable id={props.id} type={props.type}>
                <SearchHighlight search={props.filter}>{props.content}</SearchHighlight>
                <Badge>{props.count}</Badge>
            </StyledHeader>
        }
        expanded={props.expanded}
    >
        <Group.Items>{props.children}</Group.Items>
    </Expandable>
    : <Group.Items>{props.children}</Group.Items>


const PrimaryItem = styled.td`
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


Group.Items = props => <table style={{
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    // borderCollapse: 'collapse'
}}><tbody>{props.children}</tbody></table>

const SearchHighlight = props =>
    <Highlight matchStyle={{ backgroundColor: '#FACF00' }} {...props}>
        {props.children}
    </Highlight>

Group.Item = ({ id, data, filter, compact, onClick, onMouseOver, onDrop, active }) => {

    const search = filter || '';
    const [selected, toggleSelected] = useToggle(false);
    const [draggingOver, setDraggingOver] = useState(false);

    function handleClick(e) {
        e.stopPropagation();
        e.ctrlKey && toggleSelected()
        onClick && onClick();
    }

    function handleMouseOver(e) {
        e.stopPropagation();
        onMouseOver && onMouseOver();
    }


    function handleDragStart(e) {

        const { x, y, width, height } = e.target.getBoundingClientRect();
        const { clientX, clientY } = e;

        const crt = e.target.cloneNode(e.target);
        crt.style.color = "white";
        crt.style.height = `${height}px`;
        crt.style.width = `${minWidth}px`;
        crt.style.position = "absolute";
        crt.style.top = "0";
        crt.style.left = "0";
        crt.style.zIndex = "-1";
        e.target.parentNode.appendChild(crt);
        e.dataTransfer.setDragImage(crt, clientX - x, clientY - y);

        setTimeout(() => crt.parentNode.removeChild(crt), 0);

    }

    function handleDrop(e) {
        const id = e.currentTarget.id;
        console.log(id);
        e.stopPropagation();

        setDraggingOver(false);
        onDrop && onDrop(id, e);
    }

    return (
        <tr
            id={id} type='item'
            draggable
            css={css`
                padding-left: 8px;
                &:hover { background-color: #7773;  };
                background-color: ${draggingOver ? '#000f' : '#f0f0'};
                /* background-color: ${(selected || active) && '#7773'}; */
                transition: background-color 200ms ease;
            `}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onDragStart={handleDragStart}
            onDragOver={() => setDraggingOver(true)}
            onDragLeave={() => setDraggingOver(false)}
            onDrop={handleDrop}
        >
            <PrimaryItem draggingOver={draggingOver} isselected={selected.toString()} minWidth={'300px'}>
                <div>
                    <SearchHighlight search={search}>{data.Street}</SearchHighlight>
                </div>
                {!compact &&
                    <div style={{ fontSize: '0.6rem', color: '#AAAA', textTransform: 'uppercase' }}>
                        <SearchHighlight search={search}>{data.City + ' ' + data.PostalCode}</SearchHighlight>
                    </div>
                }
            </PrimaryItem>
            <td style={{ minWidth: '4ch' }}>
                <Badge>
                    <SearchHighlight search={search}>{data.Sequence}</SearchHighlight>
                </Badge>
            </td>
            <td style={{ minWidth: '4ch' }}>
                <Badge>
                    {'#'}
                    <SearchHighlight search={search}>{data.OrderId}</SearchHighlight>
                </Badge>
            </td>
            <td style={{ minWidth, maxWidth: '25vw', fontSize: '0.6rem', color: '#AAAA', textTransform: 'uppercase' }}>
                <SearchHighlight search={search}>{data.DeliveryNotes}</SearchHighlight>
            </td>
        </tr >
    )
}


export default Group;