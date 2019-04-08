import React from 'react'
import Sidebar from './sidebar';
import Minibar from './minibar';
import TextButton from './text-button';
import Toasts from './toasts';

export default function ToastSidebar({ toasts }) {
    return (
        <Sidebar.Content>
            {toasts.size
                ? <Minibar>
                    <TextButton color='#fff7' title='Clear history' visible>Clear all</TextButton>
                </Minibar>
                : <div style={{ display: 'flex', alignSelf: 'center', margin: 32, color: '#fff7' }}>History cleared!</div>
            }
            <Toasts toasts={toasts} />
        </Sidebar.Content>
    );
}
