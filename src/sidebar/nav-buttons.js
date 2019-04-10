import React from 'react'
import Sidebar from './sidebar';
import Busy from '../components/busy';

const NavButtons = ({ state, dispatch }) =>
    <>
        <Sidebar.NavButton id='City,PostalCode' active={state.groupBy === 'City,PostalCode'} onClick={state.setGroupBy} tooltip='Group by suburb'>location_city</Sidebar.NavButton>
        <Sidebar.NavButton id='PostalCode,City' active={state.groupBy === 'PostalCode,City'} onClick={state.setGroupBy} tooltip='Group by post code'>local_post_office</Sidebar.NavButton>
        <Sidebar.NavButton id='OrderId,' active={state.groupBy === 'OrderId,'} onClick={state.setGroupBy} tooltip='Sort by order number'>sort</Sidebar.NavButton>
        <Sidebar.NavButton id='Sequence,' active={state.groupBy === 'Sequence,'} onClick={dispatch('undo')} tooltip='Sort by delivery order'>format_list_numbered</Sidebar.NavButton>
        <Sidebar.NavButton id='editmode' onClick={dispatch('editmode-click')} tooltip='Auto assign'>scatter_plot</Sidebar.NavButton>
        <Sidebar.NavButton id='autoassign' onClick={dispatch('auto-assign')} tooltip='Auto assign'>timeline</Sidebar.NavButton>
        <Sidebar.NavButton id='clearall' onClick={dispatch('clear-all')} tooltip='Clear all'>clear_all</Sidebar.NavButton>
        <Sidebar.NavButton id='history' active={state.activeSidebar === 'history'} onClick={() => state.setActiveSidebar(state.activeSidebar === 'history' ? 'drivers' : 'history')} tooltip='History' badge={{ count: state.toasts.size, color: '#facf00' }}>history</Sidebar.NavButton>
        <Busy busy={state.busy} />
    </>

export default NavButtons