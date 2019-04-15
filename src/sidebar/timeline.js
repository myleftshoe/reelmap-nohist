import React from 'react'
import styled from '@emotion/styled';
import Duration from '../utils/duration';
import range from '../utils/range';


const Container = styled.div`
    height:100%;
    /* display: flex;
    flex-direction: column;
    justify-content: space-evenly; */
`

const Hour = styled.div`
    background-color: #fff3;
    padding: 2px 12px;
`

const DurationDiv = styled.div`
    padding: 0px 12px;
    margin-bottom: 1px;
    border-right: 1px dotted;
`

export default function Timeline({ state, dispath }) {
    // const [state, dispatch] = useStore(itemStore);
    const items = state.items;
    const timelineStart = Math.trunc(items.min('arrival') / 3600)
    const timelineEnd = Math.trunc(items.max('arrival') / 3600)
    console.log(timelineStart, timelineEnd)
    const timelineRange = [...range(timelineStart, timelineEnd)]
    console.log(timelineRange)
    let prevCity;
    return <Container>
        {timelineRange.map(hour => {
            const hItems = items.where('Driver', 'CHA').sortBy('arrival').filter(item => Math.trunc(item.arrival / 3600) === hour).all();
            console.log(hItems)
            return <div key={hour}>
                <p></p>
                <Hour>{hour}</Hour>
                <p></p>
                {hItems.map((item, index) => {
                    const h = item.arrival / 3600;
                    let n;
                    if (index < hItems.length - 1)
                        n = hItems[index + 1].arrival / 3600;
                    else
                        n = timelineEnd + 1;
                    const diff = n - h;
                    const mm = Math.trunc((diff - Math.floor(diff).toFixed(2)) * 600);
                    console.log(diff)

                    const ret = <div style={{ display: 'flex', height: mm % 2 === 0 ? mm : mm + 1, fontSize: '0.7rem', color: '#fff7' }}>
                        <div style={{ marginLeft: 12, flex: '0 0 100px', textAlign: 'right', opacity: item.City === prevCity ? 0 : 1 }}>{item.City.toUpperCase()}</div>
                        <DurationDiv key={item.OrderId} >
                            {Duration(item.arrival).format('{mm}')}
                            {/* ● */}
                        </DurationDiv>
                        <div style={{ marginLeft: 12 }}>{item.Street}</div>
                    </div>
                    prevCity = item.City;
                    return ret;
                }
                )}
            </div>
        })
        }
        {/* {state.items.all().map(item => <div key={item.OrderId}>{item.Street}</div>)} */}
    </Container>
}
