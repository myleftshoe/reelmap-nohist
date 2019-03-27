import React, { useState } from 'react'
import styled from '@emotion/styled'
import useToggle from '../hooks/useToggle'
import move from 'lodash-move';


const PaneContainer = styled.div`
    display:flex;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: hidden;
    flex: ${props => props.expanded ? '1 1 38px' : '0 0 38px'};
    order: ${props => props.order};
    transition: flex 0.36s ease;
    /* transition-delay: 1s */
`

const PaneContent = styled.div`
    /* padding-right:4px; */
    overflow-y: overlay;
    overflow-x: hidden;
    ::-webkit-scrollbar { width: 10px; };
    :hover::-webkit-scrollbar-thumb { background-color: #FFF3; };
    ::-webkit-scrollbar-thumb:hover { background-color: #0FF6; };
    ::-webkit-scrollbar-thumb:active { background-color: #0FFA; };
`

const PaneHeader = styled.div`
    background-color: #0003;
    /* background-color: ${props => (props.color && (props.color + '33')) || '#0003'}; */
    padding: 10px 12px 10px 12px;
    font-size:0.88em;
    text-transform: uppercase;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
    max-width:800px;
    /* border-bottom: ${props => props.active ? `${props.color} 2px solid}` : 'transparent 2px solid'}; */
`

Pane.Header = props => {
    const [active, setActive] = useState(false);
    // console.log(props.id, active, props.active, active)
    return <PaneHeader onMouseOver={() => setActive(true)} onMouseLeave={() => setActive(false)} {...props} active={active || props.active} >
        {props.children(active)}
    </PaneHeader>
}

function Pane(props) {

    const [expanded, toggleExpanded] = useToggle(props.expanded);

    let _expanded = props.expanded || expanded;
    if (props.keepOpen)
        if (props.id === props.keepOpen)
            _expanded = true;
        else
            _expanded = false;

    function handleDragStart(e) {
        console.log(e.target)
        const id = e.target.id;
        const type = e.target.getAttribute('type');
        // if (type === 'pane') {
        //     e.preventDefault()
        //     return;
        // }

        const selectedElements = document.querySelectorAll(`[type="${type}"][isselected="true"]`);
        const selectedIds = new Set([...selectedElements].map(({ id }) => id));
        selectedIds.add(id);

        const data = { type, id, selected: [...selectedIds] }
        e.dataTransfer.setData('text/plain', JSON.stringify(data))
    }

    function handleDrop(e) {

        const transferredData = JSON.parse(e.dataTransfer.getData("text/plain"));
        console.log(transferredData);

        const { type, id } = transferredData;
        if (type === 'header') {
            const sourcePaneId = id;
            const targetPane = e.currentTarget;
            const targetPaneId = targetPane.id;
            const panes = [...targetPane.parentNode.children]
            const paneOrder = panes.filter(element => element.id).map(element => element.id);
            const newPaneOrder = move(paneOrder, paneOrder.indexOf(sourcePaneId), paneOrder.indexOf(targetPaneId));
            props.onReorder(newPaneOrder);
        }
        // else {
        props.onDrop && props.onDrop(transferredData, e);
        // }
    }

    function handleDragOver(e) {
        console.log('onDragOver')
        e.stopPropagation();
        e.preventDefault();
    }

    let header;
    let content = props.children || [[]];
    if (content[0].type === Pane.Header) {
        header = content[0];
        content = content.slice(1)
    }

    let flex = null;
    if (props.keepOpen) {
        if (props.keepOpen === props.id)
            flex = '1 1 38px'
        else
            flex = '0 0 0px'
    }
    return (
        <PaneContainer
            id={props.id}
            type='pane'
            // draggable
            expanded={_expanded}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseOver={props.onMouseOver}
            onClick={props.onClick}
            style={{ flex }}
        >
            <div onClick={toggleExpanded} >
                {header}
            </div>
            <PaneContent>
                {content}
            </PaneContent>
        </PaneContainer >
    )
}

export default Pane;