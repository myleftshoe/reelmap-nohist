import React from 'react'
import NavButton from './nav-button';
import Busy from '../common/busy';

function NavButtons({ state, dispatch }) {
    function handleClick(btnId) {
        state.setGroupBy(btnId);
        state.setActiveSidebar('drivers');
    }
    return <>
        <NavButton id='City,PostalCode' active={state.groupBy === 'City,PostalCode'} onClick={handleClick} tooltip='Group by suburb'>location_city</NavButton>
        <NavButton id='PostalCode,City' active={state.groupBy === 'PostalCode,City'} onClick={handleClick} tooltip='Group by post code'>local_post_office</NavButton>
        <NavButton id='OrderId,' active={state.groupBy === 'OrderId,'} onClick={handleClick} tooltip='Sort by order number'>sort</NavButton>
        <NavButton id='Sequence,' active={state.groupBy === 'Sequence,'} onClick={handleClick} tooltip='Sort by delivery order'>format_list_numbered</NavButton>
        <NavButton id='editmode' onClick={dispatch('editmode-click')} tooltip='Auto assign'>scatter_plot</NavButton>
        <NavButton id='autoassign' onClick={dispatch('auto-assign')} tooltip='Auto assign'>timeline</NavButton>
        <NavButton id='clearall' onClick={dispatch('clear-all')} tooltip='Clear all'>clear_all</NavButton>
        <NavButton id='history' active={state.activeSidebar === 'history'} onClick={() => state.setActiveSidebar('history')} tooltip='History' badge={{ count: state.toasts.size, color: '#facf00' }}>history</NavButton>
        <Busy busy={state.busy} />
    </>
}

export default NavButtons