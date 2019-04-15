import React from 'react'
import styled from '@emotion/styled';
import Duration from '../utils/duration';

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
        <div>Duration: {Duration(duration + service).format()}</div>
        <div>Travel time: {Duration(duration).format()}</div>
        <div>Service time: {Duration(service).format()}</div>
        <div>Distance: {Math.round(distance / 1000)} kms</div>
        {/* <button onClick={handleClick}>Use</button> */}
    </SolutionContainer>
}
