import styled from '@emotion/styled';

export const badgeBase = `
    min-width:1ch;
    padding-left: .8ch;
    padding-right: .8ch;
    // padding-bottom: 1px;
    border-radius: .64rem;
    font-size: .64rem;
    font-weight:500;
    text-align: center;
    vertical-align: middle;
`

const Badge = styled.span`
    ${badgeBase}
    background-color:${props => props.color};
    color:${props => props.color && '#000'};
    float: right;
`

export default Badge;