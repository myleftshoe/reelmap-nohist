import React from 'react'
import Badge from '../common/badge'
import Expandable from "../expandable/expandable";
import useToggle from '../hooks/useToggle';
import { useState } from 'react';
import { Header, SearchHighlight, Table, Row, Address, Street, CityWithPostCode, Numeric, Notes } from './group.sc';

const minWidth = 300;

function Group(props) {
    const items = props.items.map(item =>
        <Group.Item
            id={item.OrderId}
            key={item.OrderId}
            data={item}
            filter={props.filter}
            compact={props.content !== 'undefined'}
            active={item.OrderId === props.activeItemId}
            onClick={() => props.onItemClick(item.OrderId)}
        />);
    if (!props.flatten) return (
        <Expandable
            key={props.id}
            onClick={() => props.onHeaderClick && props.onHeaderClick(props.content)}
            expanded={props.expanded}
            content={
                <Header draggable id={props.id} type={props.type}>
                    <SearchHighlight search={props.filter}>{props.content}</SearchHighlight>
                    <Badge>{props.count}</Badge>
                </Header>
            }
        >
            <Group.Items>
                {items}
            </Group.Items>
        </Expandable>
    );
    return <Group.Items>{items}</Group.Items>
}


Group.Items = props => <Table>{props.children}</Table>


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

        // const { x, y, width, height } = e.target.firstChild.getBoundingClientRect();
        const { x, y } = e.target.getBoundingClientRect();
        const { clientX, clientY } = e;

        const crt = e.target.cloneNode(e.target);
        crt.style.color = "white";
        // crt.style.backgroundColor = "red";
        // crt.style.backgroundColor = "#1d2f3d";
        // crt.style.height = `${height}px`;
        crt.style.width = `${minWidth}px`;
        crt.style.position = "absolute";
        crt.style.top = "0";
        crt.style.left = "0";
        crt.style.zIndex = "-1";
        e.target.parentNode.appendChild(crt);
        e.dataTransfer.setDragImage(crt, clientX - x + 8, clientY - y + 10);

        setTimeout(() => crt.parentNode.removeChild(crt), 0);

    }

    return (
        <Row
            id={id} type='item'
            draggable
            draggingOver={draggingOver}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onDragStart={handleDragStart}
            onDragOver={() => setDraggingOver(true)}
            onDragLeave={() => setDraggingOver(false)}
            onDrop={() => setDraggingOver(false)}
        >
            <Address draggable='false' id={id} compact={compact} isselected={selected.toString()} minWidth={`${minWidth}px`}>
                <Street>
                    <SearchHighlight search={search}>{data.Street}</SearchHighlight>
                </Street>
                {!compact &&
                    <CityWithPostCode>
                        <SearchHighlight search={search}>{data.City + ' ' + data.PostalCode}</SearchHighlight>
                    </CityWithPostCode>
                }
            </Address>
            <Numeric>
                <SearchHighlight search={search}>{data.Sequence || ''}</SearchHighlight>
            </Numeric>
            <Numeric>
                {'#'}
                <SearchHighlight search={search}>{data.OrderId}</SearchHighlight>
            </Numeric>
            <Notes minWidth={minWidth}>
                <SearchHighlight search={search}>{data.DeliveryNotes}</SearchHighlight>
            </Notes>
        </Row>
    )
}

export default Group;