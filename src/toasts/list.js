import React, { useState } from 'react'
import posed, { PoseGroup } from 'react-pose';
import styled from '@emotion/styled';
import Minibar from '../common/minibar';
import Expandable from '../expandable/expandable';
import { useStore } from 'outstated'
import { store } from '.'
import useToggle from '../hooks/useToggle';

const toast = {};

toast.style = styled.div`
    background-color: ${props => props.selected ? '#6666' : '#0003'};
    margin: 4px 12px 4px 8px;
    padding-bottom: 8px;
`

toast.pose = posed(toast.style)({
    // draggable: true
    // enter: { opacity: 1, delay: 300 },
    // exit: { opacity: 0 },
    // pressable: true,
    // init: { scale: 1 },
    // press: { scale: 0.95 }
});

const Toast = toast.pose


const ToastItem = ({ id, toast, toastActions, selected, onClick }) => {
    const [expanded, toggleExpanded] = useToggle(false);
    function handleClick() {
        toastActions.select(id);
        onClick && onClick(id);
    }
    return <Toast selected={selected}>
        <Minibar>
            <Minibar.Button title='Restore' visible onClick={toggleExpanded}>expand_more</Minibar.Button>
            <Minibar.Button title='Delete' visible onClick={() => toastActions.remove(id)}>clear</Minibar.Button>
        </Minibar>
        <Expandable key={'totals'} expanded={expanded} content={toast.content} onClick={handleClick}>
            {toast.expandedContent.map((ec, index) =>
                <div key={index} style={{ marginTop: 8 }}>
                    {ec}
                </div>
            )}
        </Expandable>
    </Toast>
}


export default function ToastList({ onSelect, onDelete }) {
    const [selectedId, setSelectedId] = useState();
    const [toasts, toastActions] = useStore(store);
    return (
        <PoseGroup>{
            [...toasts.entries()].reverse().map(([key, toast], index) =>
                <ToastItem key={key} id={key} toast={toast} toastActions={toastActions} selected={key === selectedId} onClick={setSelectedId} />
            )}
        </PoseGroup>
    )
}