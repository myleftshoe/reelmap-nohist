import React from 'react'
import styled from '@emotion/styled';
import TextButton from '../components/text-button';

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
export default function MarkerInfoWindowContent({ item = {}, color }) {
    if (!item) return null;
    return <>
        <PrimaryText>{item.Street}</PrimaryText>
        <SecondaryText>{`${item.City}, ${item.PostalCode}`}</SecondaryText>
        <TextButton color={color}>{item.Driver || 'UNASSIGNED'}</TextButton>
    </>
}
