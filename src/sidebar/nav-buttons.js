import React from 'react'
import NavButton from './nav-button';
import Busy from '../common/busy';
import { theme } from '../common/constants';

function NavButtons({ state, dispatch, onSidebarChange, activeSidebar }) {

    function handleClick(buttonId) {
        switch (buttonId) {
            case 'timeline': {
                onSidebarChange('timeline');
                break;
            }
            case 'history': {
                onSidebarChange('history');
                break;
            }
            case 'settings': {
                onSidebarChange('settings');
                break;
            }
            default: {
                state.setSortBy(buttonId);
                onSidebarChange('drivers')
            }
        }
    }

    return <>
        <NavButton id='City' active={state.sortBy === 'City'} onClick={handleClick} tooltip='By suburb'>location_city</NavButton>
        <NavButton id='OrderId' active={state.sortBy === 'OrderId'} onClick={handleClick} tooltip='By order number'>sort</NavButton>
        <NavButton id='Sequence' active={state.sortBy === 'Sequence'} onClick={handleClick} tooltip='By delivery order'>format_list_numbered</NavButton>
        <NavButton id='history' active={activeSidebar === 'history'} onClick={handleClick} tooltip='History' badge={{ count: state.toasts.size, color: theme.badgeColor }}>history</NavButton>
        <div style={{ height: 1, width: '100%', backgroundColor: '#fff1', margin: '24px 0px' }} />
        <NavButton id='settings' onClick={handleClick} tooltip='Settings'>settings</NavButton>
        <Busy busy={state.busy} />
    </>
}

export default NavButtons