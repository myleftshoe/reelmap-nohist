import React from 'react'
import styled from '@emotion/styled'
import Tooltip from '../common/tooltip'
import { badgeBase } from '../common/badge';

const Sidebar = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 100vh;
    background-color: #1f384b;
`

Sidebar.Navigation = styled.div`
    text-align: center;
    padding-top:8px;
    padding-bottom:8px;
    background-color: #2c2c2f;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .16);
    grid-row: 1/-1; /* stretch from first grid line to last grid line */
    display:flex;
    flex-direction:column;
    user-select:none;
    z-index:1;
`

Sidebar.Content = styled.div`
    overflow:auto;
    color: #fffc;
    /* background-color: #213e48; */
    /* background-color: #272746; */
    /* background-color: #1f384b; */
    display:flex;
    flex-direction: column;
    font-size:0.96em;
    overflow-y: overlay;
    overflow-x: hidden;
    ::-webkit-scrollbar { width: 10px; };
    :hover::-webkit-scrollbar-thumb { background-color: #FFF3; };
    ::-webkit-scrollbar-thumb:hover { background-color: #0FF6; };
    ::-webkit-scrollbar-thumb:active { background-color: #0FFA; };
`

const NavButton = styled.div`
    position:relative;
    padding: 12px 8px;
    color: ${props => props.active ? 'white' : 'gray'};
    &:hover {
        color:white;
        cursor:pointer;
    };
    &[data-count]:after{
        position:absolute;
        content: attr(data-count);
        min-width: calc(1ch + 1px);
        ${badgeBase}
        color:#000;
        bottom:25%;
        right:20%;
        background: ${props => props.badgeColor};
    }
`

Sidebar.NavButton = props => {
    const { id, active, onClick, children: icon } = props;
    const { badge = {} } = props;
    const handleClick = () => onClick && onClick(id);
    return <Tooltip position="right" content={props.tooltip}>
        <NavButton active={active} onClick={handleClick} data-count={badge.count > 0 ? badge.count : null} badgeColor={badge.color}>
            <i className="material-icons">{icon}</i>
        </NavButton >
    </Tooltip>
}


export default Sidebar