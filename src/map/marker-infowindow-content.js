import React, { useState } from 'react'
import styled from '@emotion/styled';
import TextButton from '../components/text-button'

const PrimaryText = styled.div`
    padding-top:8px;
    display:flex;
    flex-direction: column;
    align-items: flex-start;
`

const SecondaryText = styled.div`
    font-size: 0.61rem;
    font-weight:600;
    text-transform: uppercase;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`


const Hideable = styled.span`
    /* visibility: ${props => props.hidden ? 'hidden' : 'visible'}; */
    /* display: ${props => props.hidden && 'none'}; */
    /* opacity: ${props => props.visible ? 1 : 0.2}; */
    opacity:${({ visible }) => visible ? 1 : 0};
    /* :hover { opacity : 1;}; */
    transition: opacity .3s ease;
`

export default function MarkerInfoWindowContent({ item = {}, color, onDriverChange, dropDownValues }) {
    if (!item) return null;
    const [visible, setVisible] = useState(false);
    function handleClick(id) {
        // toggleVisible();
        console.log(item.OrderId, id);
        onDriverChange(item.OrderId, id);
    }
    return <Container>
        <PrimaryText>{item.Street}</PrimaryText>
        <SecondaryText>{`${item.City}, ${item.PostalCode}`}</SecondaryText>
        <span onMouseOver={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <TextButton color={color}>{item.Driver || 'UNASSIGNED'}</TextButton>
            <Hideable visible={visible}>
                {Object.keys(dropDownValues).filter(key => key !== item.Driver && key !== 'UNASSIGNED').map(key =>
                    <TextButton key={key} color={dropDownValues[key]} onClick={() => handleClick(key)}>{key}</TextButton>
                )}
            </Hideable>
        </span>
    </Container>
}
