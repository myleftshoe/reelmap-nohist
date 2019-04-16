import styled from '@emotion/styled';

const padding = 'padding: 4px 6px;'

const Container = styled.div`
    user-select: none;
`

const Row = styled.div`
    display: flex;
    font-size: 0.7rem;
    color: #fff7;
    :hover {background-color: #fff3};
`
const Primary = styled.div`
    ${padding};
    flex: 0 0 100px;
    text-align: right;
    visibility: ${props => !props.visible && 'hidden'};
`

const Secondary = styled.div`
    ${padding};
    flex: 0 0 200px;
    margin-left: 12px;
`

const Number = styled.div`
    ${padding};
    flex: 0 0 4ch;
    text-align:right;
`

const Time = styled.div`
    ${padding};
    flex: 0 0 6ch;
    text-align:right;
`

const Notes = styled.div`
    ${padding};
    flex: 1 0 420px;
`

export { Container, Row, Primary, Secondary, Number, Time, Notes }