import styled from '@emotion/styled'

const Sidebar = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 100vh;
    background-color: #1f384b;
`

Sidebar.Navigation = styled.div`
    text-align: center;
    padding-top:8px;
    padding-bottom:8px;
    background-color: #2c2c2f;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .16);
    grid-row: 1/-1; /* stretch from first grid line to last grid line */
    display:flex;
    flex-direction:column;
    user-select:none;
    z-index:1;
`

Sidebar.Content = styled.div`
    overflow:auto;
    color: #fffc;
    /* background-color: #213e48; */
    /* background-color: #272746; */
    /* background-color: #1f384b; */
    display:flex;
    flex-direction: column;
    font-size:0.96em;
    overflow-y: overlay;
    overflow-x: hidden;
    ::-webkit-scrollbar { width: 10px; };
    :hover::-webkit-scrollbar-thumb { background-color: #FFF3; };
    ::-webkit-scrollbar-thumb:hover { background-color: #0FF6; };
    ::-webkit-scrollbar-thumb:active { background-color: #0FFA; };
`

export default Sidebar