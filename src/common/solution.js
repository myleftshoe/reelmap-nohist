import React from 'react'
import styled from '@emotion/styled';
import formattedDuration from '../utils/formatted-duration';

const SolutionContainer = styled.div`
    display:flex;
    flex-direction:column;
    font-size:0.7rem;
    /* color:#fff7; */
    margin-left:12px;
`

export default function Solution({ duration, distance, service, onButtonClick }) {
    const handleClick = e => {
        e.stopPropagation();
        onButtonClick();
    }
    return <SolutionContainer>
        <div>Duration: {formattedDuration(duration + service)}</div>
        <div>Travel time: {formattedDuration(duration)}</div>
        <div>Service time: {formattedDuration(service)}</div>
        <div>Distance: {Math.round(distance / 1000)} kms</div>
        {/* <button onClick={handleClick}>Use</button> */}
    </SolutionContainer>
}
