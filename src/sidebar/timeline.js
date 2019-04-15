import React from 'react'
import styled from '@emotion/styled';
import Duration from '../utils/duration';
import range from '../utils/range';
import { by2 } from '../utils/sort';
import by from 'sort-by';

const Container = styled.div`
    height:100%;
    /* display: flex;
    flex-direction: column;
    justify-content: space-evenly; */
`

const Hour = styled.div`
    background-color: #fff3;
    padding: 2px 12px;
    /* height:1px; */
    /* background-color:white; */
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
    const timelineEnd = Math.trunc(items.max('arrival') / 3600) + 1;
    console.log(timelineStart, timelineEnd)
    const timelineRange = [...range(timelineStart, timelineEnd)]
    console.log(timelineRange)
    let prevCity;
    let prevHour = timelineStart-1;
    // const _items = [...items.all()].sort(by2('Driver', 'arrival'))
    const hItems = items.where('Driver', 'SAM1').all().sort(by('Driver', 'arrival'));
    console.table(hItems, ['Driver', 'OrderId', 'Sequence', 'arrival'])
    return <Container>
        {/* {timelineRange.map(hour => {
            const hItems = items.where('Driver', 'CHA').sortBy('arrival').filter(item => Math.trunc(item.arrival / 3600) === hour).all();
            console.log(hItems)
            return <div key={hour}>
                <p></p>
                <Hour>{hour}</Hour>
                <p></p> */}
                {hItems.map((item, index) => {

                    const time = item.arrival/3600;
                    const nextItem = hItems[index + 1];
                    const nextTime = nextItem ? nextItem.arrival/3600 : timelineEnd;

                    const hour = Math.trunc(time);
                    const nextHour = Math.trunc(nextTime)
                    const showHour = hour > prevHour;

                    let diff = nextTime - time;
                    if (nextHour > hour) {
                        diff = nextHour - time;
                    }
                    let dummymm;
                    if (hour > prevHour) {
                        const dummyDiff = time - hour
                        dummymm = Math.trunc((dummyDiff - Math.floor(dummyDiff).toFixed(2)) * 600);
                    }
                    const mm = Math.trunc((diff - Math.floor(diff).toFixed(2)) * 600) + 20;
                    if (hour > prevHour)  {
                        console.log(mm, diff, nextHour, time)
                    }
                    const log = {time, nextTime, hour, nextHour, showHour, diff, mm, dummymm}
                    console.table(log)
                    const ret = <>
                    {showHour && <Hour>{hour}</Hour>}
                    {dummymm && <div style={{height: dummymm % 2 === 0 ? dummymm : dummymm + 1, width:'148px',borderRight: '1px dotted #fff7'}}></div>}
                    <div style={{ display: 'flex', height: mm % 2 === 0 ? mm : mm + 1, fontSize: '0.7rem', color: '#fff7' }}>
                        <div style={{ marginLeft: 12, flex: '0 0 100px', textAlign: 'right', opacity: item.City === prevCity ? 0 : 1 }}>{item.City.toUpperCase()}</div>
                        <DurationDiv key={item.OrderId} >
                            {Duration(item.arrival).format('{mm}')}
                            {/* ● */}
                        </DurationDiv>
                        <div style={{ marginLeft: 12 }}>{item.Street}</div>
                    </div>
                    </>
                    prevCity = item.City;
                    prevHour = hour;
                    return ret;
                }
                )}
            {/* </div>
        })
        } */}
        {/* {state.items.all().map(item => <div key={item.OrderId}>{item.Street}</div>)} */}
    </Container>
}
