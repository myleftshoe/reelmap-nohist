import React from 'react'
import styled from '@emotion/styled'
import Tooltip from './tooltip'

const Sidebar = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 100vh;
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
`

Sidebar.Content = styled.div`
    overflow:auto;
    color: #fffc;
    /* background-color: #213e48; */
    /* background-color: #272746; */
    background-color: #1f384b;
    display:flex;
    flex-direction: column;
    font-size:0.96em;
`

const NavButton = styled.div`
    padding: 12px 8px;
    color: ${props => props.active ? 'white' : 'gray'};
    &:hover {
        color:white;
        cursor:pointer;
    };
`

Sidebar.NavButton = props => {
    const { id, active, onClick, children: icon } = props;
    const handleClick = () => onClick && onClick(id);
    return <Tooltip position="right" content={props.tooltip}>
        <NavButton active={active} onClick={handleClick}>
            <i className="material-icons">{icon}</i>
        </NavButton >
    </Tooltip>
}


export default Sidebar