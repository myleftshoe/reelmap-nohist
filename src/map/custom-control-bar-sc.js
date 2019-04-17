import css from '@emotion/css';
import styled from '@emotion/styled'

const S = {}

S.ControlBar = styled.div`
    overflow:hidden;
    background-color: ${({ color }) => color || '#fff'};
    display:flex;
    flex-direction: ${({ vertical }) => vertical ? 'column' : 'row'};
    justify-content:space-between;
    align-items:stretch;
    margin:10px;
    filter: drop-shadow(0px 1px 1px #00000028);
    border-radius:2px;
    cursor:pointer;
    user-select:none;
`

S.ButtonBase = ({ vertical, color, active = false, disabled }) => css`
    display:flex;
    align-items:center;
    justify-content: center;
    border:none;
    outline:none;
    color:${color};
    opacity:0.66;
    background: none;
    ${active && 'background-color: #00000030;'}
    ${!disabled &&
    `:hover {
        opacity:1;
        background-color:#00000015;
    };`}
    ${vertical
        ? 'border-top: 1px solid #00000015'
        : 'border-left: 1px solid #00000015'
    };
    :first-of-type {
        border-left: none;
        border-top: none;
    }
`

// Small size
S.ButtonSmall = css`
    min-width:24px;
    min-height:24px;
`

S.IconButtonSmall = styled.button`
    ${S.ButtonBase};
    ${S.ButtonSmall}
    padding:2px;
    font-size:16px;
`

S.TextButtonSmall = styled.button`
    ${S.ButtonBase};
    ${S.ButtonSmall}
    padding:2px 12px;
    font-size:12px;
`

// Normal size
S.Button = css`
    min-width:40px;
    min-height:40px;
`
S.IconButton = styled.button`
    ${S.ButtonBase};
    ${S.Button}
    padding:8px;
    font-size:20px;
`
S.TextButton = styled.button`
    ${S.ButtonBase};
    ${S.Button}
    padding:8px 17px;
    font-size:18px;
`

console.log(S.ButtonSmall)

export default S;