import React from 'react'
import Minibar from './minibar';
import TextButton from './text-button';
import Toasts from './toasts';
import { useStore } from 'outstated'
import toastStore from '../stores/toast-store'

export default function ToastSidebar({ toasts }) {
    const [state, dispatch] = useStore(toastStore);
    return (
        <>
            {state.size
                ? <Minibar>
                    <TextButton color='#fff7' title='Clear history' visible onClick={() => dispatch.clear()}>Clear all</TextButton>
                </Minibar>
                : <div style={{ display: 'flex', alignSelf: 'center', margin: 32, color: '#fff7' }}>Empty!</div>
            }
            <Toasts toasts={toasts} />
        </>
    );
}
