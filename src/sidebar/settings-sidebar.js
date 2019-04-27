import React, { useState } from 'react'
import styled from '@emotion/styled';
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import Pane from '../panes/pane';
import './table.css'
import ColorPicker from './color-picker';
import SimpleTimeField from 'react-simple-timefield';

export const Header = styled.span`
    display: flex;
    justify-content: space-between;
    align-items:center;
    margin-top: 8px;
    padding: 0 12px 0 12px;
    line-height: 2.0rem;
    /* font-size: 0.6rem; */
    color: #aaaa;
    max-width: 800px;
    text-transform: uppercase;
    /* max-width:312px; */
    &:hover { background-color: #7773; };
`


const HeaderLeft = styled.div`
    display:flex;
    align-items: center;
`

const HeaderRight = styled.div`
    display:flex;
    align-items: center;
    font-size:.8rem;
    color:#fff;
`

const Driver = styled.div`
    margin: 0px 4px;
`

const Container = styled.div`
    font-size:0.7rem;
`

const Content = styled.div`
    display:flex;
    flex-direction:column;
    line-height:24px;
`

const SidebarTitle = styled.h2`
    padding: 0px 12px;
`

const Row = styled.div`
    display:flex;
    padding-left:37px;
    :hover { background-color: #fff3 }
`

const Cell = styled.div`
    flex: 0 0 150px;
`

const TimeField = styled(SimpleTimeField)`
    border: none;
    /* outline:none; */
    background-color: transparent;
    /* font-size: 0.7rem; */
    color: white;
    padding: 4px 6px 4px 8px;
`



function SettingsSidebar({ state, dispatch }) {
    const [time, setTime] = useState('09:00')
    const [drivers, driverActions] = useStore(driverStore);
    console.log(drivers)
    return (
        <>
            <SidebarTitle>Settings</SidebarTitle>
            <Pane
                title='Drivers'
                onMaximize={() => { }}
                expanded={true}
            >
                {[...drivers.values()].map(driver =>
                    <React.Fragment key={driver.id}>
                        <Header>
                            <HeaderLeft>
                                <ColorPicker color={driver.color} onChange={color => driverActions.setColor(driver.id, color)}></ColorPicker>
                                <Driver key={driver.id}>{driver.id}</Driver>
                            </HeaderLeft>
                            <HeaderRight>
                                ✓
                            </HeaderRight>
                        </Header>
                        <Content>
                            <Row>
                                <Cell>Typical Start</Cell>
                                <Cell>
                                    <TimeField
                                        value={time}
                                        onChange={setTime}
                                    />
                                </Cell>
                            </Row>
                            <Row>
                                <Cell>Typical End</Cell>
                                <Cell>
                                    {/* <TimePicker start={9} end={17} value={time} onChange={setTime} /> */}
                                    <TimeField
                                        value={time}
                                        onChange={setTime}
                                    />
                                </Cell>
                            </Row>
                            <Row>
                                <Cell>Max. End</Cell>
                                <Cell>
                                    <TimeField
                                        value={time}
                                        onChange={setTime}
                                    />
                                </Cell>
                            </Row>
                        </Content>

                    </React.Fragment>
                )
                }
            </Pane>
        </>
    )
}

export default SettingsSidebar;
