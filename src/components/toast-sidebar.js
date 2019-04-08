import React from 'react'
import Sidebar from './sidebar';
import Minibar from './minibar';
import TextButton from './text-button';
import Toasts from './toasts';
import { useStore } from 'outstated'
import toastStore from '../stores/toast-store'

export default function ToastSidebar({ toasts }) {
    const [state, dispatch] = useStore(toastStore);
    return (
        <Sidebar.Content>
            {state.size
                ? <Minibar>
                    <TextButton color='#fff7' title='Clear history' visible onClick={() => dispatch({ type: 'clear' })}>Clear all</TextButton>
                </Minibar>
                : <div style={{ display: 'flex', alignSelf: 'center', margin: 32, color: '#fff7' }}>History cleared!</div>
            }
            <Toasts toasts={toasts} />
        </Sidebar.Content>
    );
}
