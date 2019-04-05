import React from 'react'
import styled from '@emotion/styled';
import ms from 'ms';

function formattedDuration(seconds) {
    const m = seconds / 3600;
    const hh = Math.floor(m);
    const mm = Math.round((m % 1) * 60);
    return `${hh}h ${mm}m`;
}

const SolutionContainer = styled.div`
    display:flex;
    flex-direction:column;
`

export default function Solution({ duration, distance, service }) {
    console.log(ms(2 * 3860000))
    return <SolutionContainer>
        <div>Total duration: {formattedDuration(duration + service)}</div>
        <div>Total travel time: {formattedDuration(duration)}</div>
        <div>Total service time: {formattedDuration(service)}</div>
        <div>Total distance: {Math.round(distance / 1000)} kms</div>
    </SolutionContainer>
}
