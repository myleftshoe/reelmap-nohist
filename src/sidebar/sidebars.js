import React from 'react'
import Sidebar from './sidebar';
import ToastSidebar from './toast-sidebar';
import DriverSidebar from './driver-sidebar';
import NavButtons from './nav-buttons';

const Sidebars = ({ state, dispatch }) =>
    <Sidebar>
        <Sidebar.Navigation>
            <NavButtons state={state} dispatch={dispatch} />
        </Sidebar.Navigation>
        <Sidebar.Content>
            {state.activeSidebar === 'history'
                ? <ToastSidebar />
                : <DriverSidebar state={state} dispatch={dispatch} />
            }
        </Sidebar.Content>
    </Sidebar >

export default Sidebars;
