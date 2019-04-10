import React from 'react'
import Minibar from '../common/minibar';
import TextButton from '../common/text-button';
import ToastList from './list';
import { useStore } from 'outstated'
import toastStore from './store'

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
            <ToastList toasts={toasts} />
        </>
    );
}
