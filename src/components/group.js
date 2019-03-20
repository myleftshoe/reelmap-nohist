/** @jsx jsx */
// import React from 'react';
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'
import Highlight from 'react-highlighter'
import Badge from './badge'
import Expandable from "./expandable";
import useToggle from '../hooks/useToggle';

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


Group.Items = props => <table style={{
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    // borderCollapse: 'collapse'
}}><tbody>{props.children}</tbody></table>

const SearchHighlight = props =>
    <Highlight matchStyle={{ backgroundColor: '#FACF00' }} {...props}>
        {props.children}
    </Highlight>

Group.Item = ({ id, data, filter, compact, onClick, onMouseOver, active }) => {

    const search = filter || '';
    const [selected, toggleSelected] = useToggle(false);

    function handleClick(e) {
        e.stopPropagation();
        e.ctrlKey && toggleSelected()
        onClick && onClick();
    }

    function handleMouseOver(e) {
        e.stopPropagation();
        onMouseOver && onMouseOver();
    }

    return (
        <tr
            css={css`
                padding-left: 8px;
                &:hover { background-color: #7773; };
                background-color: ${(selected || active) && '#7773'};
            `}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
        >
            <td id={id} type='item' isselected={selected.toString()} draggable style={{ minWidth, paddingLeft: compact ? 26 : 12, paddingTop: 4, paddingBottom: 4, backgroundColor: '#f0f0', fontSize: '0.8rem' }}>
                <div>
                    <SearchHighlight search={search}>{data.Street}</SearchHighlight>
                </div>
                {!compact &&
                    <div style={{ fontSize: '0.6rem', color: '#AAAA', textTransform: 'uppercase' }}>
                        <SearchHighlight search={search}>{data.City + ' ' + data.PostalCode}</SearchHighlight>
                    </div>
                }
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