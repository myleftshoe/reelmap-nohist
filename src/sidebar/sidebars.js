import React, { useState } from 'react'
import Sidebar from './sidebar';
import ToastSidebar from './toast-sidebar';
import DriverSidebar from './driver-sidebar';
import NavButtons from './nav-buttons';
import Timeline from './timeline';

function Sidebars({ state, dispatch }) {

    const [activeSidebar, setActiveSidebar] = useState('drivers');

    let sidebar;
    switch (activeSidebar) {
        case 'timeline': {
            sidebar = <Timeline />
            break;
        }
        case 'history': {
            sidebar = <ToastSidebar />
            break;
        }
        case 'drivers': {
            sidebar = <DriverSidebar state={state} dispatch={dispatch} />
            break;
        }
        default: { }
    }
    return (
        <Sidebar>
            <Sidebar.Navigation>
                <NavButtons state={state} dispatch={dispatch} activeSidebar={activeSidebar} onSidebarChange={setActiveSidebar} />
            </Sidebar.Navigation>
            <Sidebar.Content>
                {sidebar}
            </Sidebar.Content>
        </Sidebar >
    )
}

export default Sidebars;
