import React from 'react'
import NavButton from './nav-button';
import Busy from '../common/busy';
import { theme } from '../common/constants';

function NavButtons({ state, dispatch, onSidebarChange, activeSidebar }) {

    function handleClick(btnId) {
        switch (btnId) {
            case 'timeline': {
                onSidebarChange('timeline');
                break;
            }
            case 'history': {
                onSidebarChange('history');
                break;
            }
            // case 'editmode':
            // case 'autoassign': {
            //     break;
            // }
            default: {
                state.setSortBy(btnId);
                onSidebarChange('drivers')
            }
        }
    }

    return <>
        <NavButton id='City' active={state.sortBy === 'City'} onClick={handleClick} tooltip='By suburb'>location_city</NavButton>
        {/* <NavButton id='PostalCode,City' active={state.sortBy === 'PostalCode,City'} onClick={handleClick} tooltip='Group by post code'>local_post_office</NavButton> */}
        <NavButton id='OrderId' active={state.sortBy === 'OrderId'} onClick={handleClick} tooltip='By order number'>sort</NavButton>
        <NavButton id='Sequence' active={state.sortBy === 'Sequence'} onClick={handleClick} tooltip='By delivery order'>format_list_numbered</NavButton>
        {/* <NavButton id='editmode' onClick={dispatch('editmode-click')} tooltip='Auto assign'>scatter_plot</NavButton> */}
        {/* <NavButton id='autoassign' onClick={dispatch('auto-assign')} tooltip='Auto assign'>timeline</NavButton> */}
        {/* <NavButton id='timeline' active={activeSidebar === 'timeline'} onClick={handleClick} tooltip='Timeline'>timeline</NavButton> */}
        {/* <NavButton id='arrival' active={state.sortBy === 'arrival'} onClick={handleClick} tooltip='Auto assign'>timeline</NavButton> */}
        <NavButton id='history' active={activeSidebar === 'history'} onClick={handleClick} tooltip='History' badge={{ count: state.toasts.size, color: theme.badgeColor }}>history</NavButton>
        <NavButton id='clearall' onClick={dispatch('clear-all')} tooltip='Clear all'>warning</NavButton>
        <Busy busy={state.busy} />
    </>
}

export default NavButtons