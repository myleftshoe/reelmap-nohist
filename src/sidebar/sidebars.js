import React, { useState } from 'react'
import Sidebar from './sidebar';
import ToastSidebar from './toast-sidebar';
import DriverSidebar from './driver-sidebar';
import NavButtons from './nav-buttons';

function Sidebars({ state, dispatch }) {

    const [activeSidebar, setActiveSidebar] = useState('drivers');

    return (
        <Sidebar>
            <Sidebar.Navigation>
                <NavButtons state={state} dispatch={dispatch} activeSidebar={activeSidebar} onSidebarChange={setActiveSidebar} />
            </Sidebar.Navigation>
            <Sidebar.Content>
                {activeSidebar === 'history'
                    ? <ToastSidebar />
                    : <DriverSidebar state={state} dispatch={dispatch} />
                }
            </Sidebar.Content>
        </Sidebar >
    )
}

export default Sidebars;
