import styled from "@emotion/styled";

export const PaneContainer = styled.div`
    display:flex;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: hidden;
    flex: ${props => props.expanded ? '1 1 38px' : '0 0 38px'};
    order: ${props => props.order};
    transition: flex 0.36s ease;
    /* transition-delay: 1s */
`

export const PaneHeader = styled.div`
    background-color: #0003;
    padding: 0px 12px;
    font-size:0.88em;
    text-transform: uppercase;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
    max-width:800px;
    flex:0 0 38px;
    :hover {cursor: pointer};
`

export const PaneContent = styled.div`
    /* padding-right:4px; */
    overflow-y: overlay;
    overflow-x: hidden;
    ::-webkit-scrollbar { width: 10px; };
    :hover::-webkit-scrollbar-thumb { background-color: #FFF3; };
    ::-webkit-scrollbar-thumb:hover { background-color: #0FF6; };
    ::-webkit-scrollbar-thumb:active { background-color: #0FFA; };
`
