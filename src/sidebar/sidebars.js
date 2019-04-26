import React, { useState } from 'react'
import Sidebar from './sidebar';
import ToastSidebar from './toast-sidebar';
import DriverSidebar from './driver-sidebar';
import NavButtons from './nav-buttons';
import Timeline from './timeline';
import { Tooltip } from 'react-tippy';
import { Button } from '@material/react-button';
import '@material/react-button/dist/button.css';
import './mdc.css'

function Sidebars({ state, dispatch }) {

    const [activeSidebar, setActiveSidebar] = useState('drivers');

    let sidebar;
    switch (activeSidebar) {
        case 'timeline': {
            sidebar = <Timeline state={state} dispath={dispatch} />
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
                {state.isUnderSubscribed &&
                    <Tooltip
                        title="Welcome to React"
                        animateFill
                        delay={[0, 1000]}
                        interactiveBorder={50}
                        html={
                            <div>
                                Route is undersubscribed.
                                The calculated solution is the most efficient, using as few vehicles as possible.
                                Do you wish to balance the solution to utilize all vehicles equally?
                                <p ></p>
                                <Button >No</Button>
                                <Button onClick={dispatch('balance-solution')}>Yes, Balance</Button>
                            </div>
                        }
                        position="bottom"
                        interactive
                        style={{ marginTop: 'auto' }}
                    // trigger="click"
                    >
                        <i className='material-icons' style={{ color: '#ffff' }}>
                            info
                        </i>
                    </Tooltip>
                }
            </Sidebar.Navigation>
            <Sidebar.Content>
                {sidebar}
            </Sidebar.Content>
        </Sidebar >
    )
}

export default Sidebars;
