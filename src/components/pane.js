import React, { useState } from 'react'
import useToggle from '../hooks/useToggle'
import move from 'lodash-move';
import Minibar from './minibar';
import Badge from './badge';
import { PaneContainer, PaneHeader, PaneContent } from './pane.sc'

function Pane(props) {

    const { actionButtons = [] } = props;

    const [expanded, toggleExpanded] = useToggle(props.expanded);
    const [headerMouseOver, setHeaderMouseOver] = useState(false);

    let _expanded = props.expanded || expanded;
    let flex = null;
    if (props.maximized) {
        if (props.id === props.maximized) {
            _expanded = true;
            flex = '1 1 38px'
        }
        else {
            _expanded = false;
            flex = '0 0 0px'
        }
    }

    function handleDragStart(e) {

        const id = e.target.id;
        const type = e.target.getAttribute('type');

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
        props.onDrop && props.onDrop(transferredData, props.id, e);
    }

    function handleDragOver(e) {
        console.log('onDragOver')
        e.stopPropagation();
        e.preventDefault();
    }

    function handleHeaderClick() {
        if (props.maximized === props.id) {
            props.onMaximize(null)
            return;
        }
        toggleExpanded();
    }

    function handleMaximizeClick() {
        props.onMaximize(props.id)
    }

    function handleActionButtonClick(id) {
        console.log(id);
        const actionButton = actionButtons.find(ab => ab.id === id);
        actionButton.onClick(props.id);
        // props.onOpenInNew(props.id)
    }

    function handleHeaderMouseOver() {
        setHeaderMouseOver(true);
    }

    function handleHeaderMouseLeave() {
        setHeaderMouseOver(false);
    }

    const showMaximizeButton = headerMouseOver && !props.maximized && expanded;

    return (
        <PaneContainer
            id={props.id}
            type='pane'
            expanded={_expanded}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseOver={props.onMouseOver}
            onClick={props.onClick}
            style={{ flex }}
        >
            <PaneHeader
                id={props.id}
                type='header'
                draggable
                onClick={handleHeaderClick}
                onMouseOver={handleHeaderMouseOver}
                onMouseLeave={handleHeaderMouseLeave}
            >
                {props.title}
                <Minibar>
                    {actionButtons.map(({ id, tooltip, icon, onClick, visible }) =>
                        visible && headerMouseOver &&
                        <Minibar.Button key={id} id={id} visible={true} onClick={handleActionButtonClick}>
                            {icon}
                        </Minibar.Button>
                    )}
                    {/* {showOpenInNewButton &&
                        <Minibar.Button visible={true} onClick={handleOpenInNewClick}>
                            open_in_new
                        </Minibar.Button>
                    } */}
                    {showMaximizeButton &&
                        <Minibar.Button visible={true} onClick={handleMaximizeClick}>
                            fullscreen
                        </Minibar.Button>
                    }
                    <Badge color={props.countColor}>{props.count}</Badge>
                </Minibar>
            </PaneHeader>
            <PaneContent>
                {props.children}
            </PaneContent>
        </PaneContainer >
    )
}

export default Pane;