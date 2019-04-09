import React from 'react'
import posed, { PoseGroup } from 'react-pose';
import styled from '@emotion/styled';
import Minibar from './minibar';
import Expandable from './expandable';
import { useStore } from 'outstated'
import toastStore from '../stores/toast-store'

const toast = {};

toast.style = styled.div`
    background-color: #0003;
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

export default function Toasts({ onSelect, onDelete }) {
    const [toasts, toastActions] = useStore(toastStore);
    return (
        <PoseGroup>{
            [...toasts.entries()].map(([key, toast], index) =>
                <Toast key={key}>
                    <Minibar>
                        <Minibar.Button title='Restore' visible >restore</Minibar.Button>
                        <Minibar.Button title='Clear history' visible onClick={() => toastActions.remove(key)}>clear</Minibar.Button>
                    </Minibar>
                    {/* <TextButton style={{ display: 'flex', width: '100%', justifyContent: 'center' }} color='#fff7' onClick={() => dispatch('apply-snapshot')(key)}>Show</TextButton> */}
                    <Expandable key={'totals'} expanded={false} content={toast.content} >
                        {toast.expandedContent.map((ec, index) =>
                            <div key={index} style={{ marginTop: 8 }}>
                                {ec}
                            </div>
                        )}
                    </Expandable>
                </Toast>
            )
        }
        </PoseGroup>
    )
}