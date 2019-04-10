import React, { useState } from 'react'
import useToggle from '../hooks/useToggle'
import Pane from './pane'
import Minibar from '../common/minibar';
import Badge from '../common/badge';

function DriverPane(props) {

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

    function handleOpenInNewClick() {
        props.onOpenInNew(props.id)
    }

    function handleHeaderMouseOver() {
        setHeaderMouseOver(true);
    }

    function handleHeaderMouseLeave() {
        setHeaderMouseOver(false);
    }

    const showMaximizeButton = headerMouseOver && !props.maximized && expanded;
    const showOpenInNewButton = headerMouseOver && props.maximized;

    // const showMaximizeButton = headerMouseOver;
    // const showOpenInNewButton = headerMouseOver;

    return (
        <Pane
            id={props.id}
            onReorder={props.onReorder}
            onDrop={props.onDrop}
            expanded={_expanded}
            flex={flex}
        >
            <Pane.Header
                id={props.id}
                type='header'
                draggable
                onClick={handleHeaderClick}
                onMouseOver={handleHeaderMouseOver}
                onMouseLeave={handleHeaderMouseLeave}
            >
                {props.title}
                <Minibar>
                    {showOpenInNewButton &&
                        <Minibar.Button visible={true} onClick={handleOpenInNewClick}>
                            open_in_new
                        </Minibar.Button>
                    }
                    {showMaximizeButton &&
                        <Minibar.Button visible={true} onClick={handleMaximizeClick}>
                            fullscreen
                        </Minibar.Button>
                    }
                    <Badge color={props.countColor}>{props.count}</Badge>
                </Minibar>
            </Pane.Header>
            <Pane.Content>
                {props.children}
            </Pane.Content>
        </Pane>
    )
}

export default DriverPane;