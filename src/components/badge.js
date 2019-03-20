import styled from '@emotion/styled';

const Badge = styled.span`
    /* color:#FFF; */
    background-color:${props => props.color};
    color:${props => props.color && '#000'};
    font-weight:${props => props.color && 500};
    min-width:1ch;
    padding-left: .8ch;
    padding-right: .8ch;
    padding-bottom: 1px;
    border-radius: .64rem;
    font-size: .64rem;
    text-align: center;
    float: right;
    vertical-align: middle;
`

export default Badge;