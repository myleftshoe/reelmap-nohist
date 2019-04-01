import css from '@emotion/css';
import styled from '@emotion/styled'

const S = {}

S.ControlBar = styled.div`
    overflow:hidden;
    background-color:#FFF;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    margin:10px;
    filter: drop-shadow(0px 1px 1px #00000028);
    border-radius:2px;
    cursor:pointer;
`

S.ButtonBase = css`
    opacity:0.66;
    display:flex;
    align-items:center;
    justify-content: center;
    :hover {
        opacity:1;
        background-color:#00000015;
    };
    border-left: 1px solid #00000015;
    :first-child {
        border-left: none;
    }
`

S.IconButton = styled.i`
    ${S.ButtonBase};
    min-width:24px;
    height:24px;
    padding:8px;
    font-size:20px;
`

S.IconButtonSmall = styled.i`
    ${S.ButtonBase}
    min-width:20px;
    height:20px;
    padding:2px;
    font-size:16px;
`

S.TextButton = styled.div`
    ${S.ButtonBase}
    font-size:18px;
    padding:8px 17px;
    min-width:24px;
    height:24px;
`

S.TextButtonSmall = styled.div`
    ${S.ButtonBase}
    font-size:12px;
    padding:2px 12px;
    min-width:20px;
    height:20px;
`

export default S;