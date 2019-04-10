import React from 'react'
import styled from '@emotion/styled'
import Tooltip from '../common/tooltip'
import { badgeBase } from '../common/badge';

const NavButtonBase = styled.div`
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

function NavButton (props) {
    const { id, active, onClick, children: icon } = props;
    const { badge = {} } = props;
    const handleClick = () => onClick && onClick(id);
    return <Tooltip position="right" content={props.tooltip}>
        <NavButtonBase active={active} onClick={handleClick} data-count={badge.count > 0 ? badge.count : null} badgeColor={badge.color}>
            <i className="material-icons">{icon}</i>
        </NavButtonBase >
    </Tooltip>
}

export default NavButton
