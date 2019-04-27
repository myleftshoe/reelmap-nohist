import React, { useState } from 'react'
import 'tippy.js/themes/light.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/themes/google.css'
import 'tippy.js/themes/translucent.css'
import Tooltip from '@tippy.js/react'
import TimeField from 'react-simple-timefield';
import styled from '@emotion/styled';




const TimeFieldS = styled(TimeField)`
    border: none;
    /* outline:none; */
    background-color: transparent;
    font-size: 0.7rem;
    color: white;
    padding: 4px 2px 4px 8px;
`

const Min = styled.td`
    opacity:0;
    :hover {opacity:1};
   /* pointer-events:none; */
`



const Container = styled.div`
    display:flex;
    align-items: center;
`


export default function TimePicker({ value, start, end, onChange }) {
    const [time, setTime] = useState(value)
    return <Container>
        <TimeFieldS
            value={time}
            onChange={setTime}
        />
        <Tooltip
            content={<Times onChange={setTime} />}
            trigger='click'
            theme='light'
            arrow
        >
            <i className='material-icons' style={{ fontSize: 20 }}>arrow_drop_down</i>
        </Tooltip>
    </Container>
}





function Times({ onChange }) {

    const [time, setTime] = useState('09:00')

    function handleMouseOver(e) {
        console.log(e.target)
        if (e.target.id)
            setTime(e.target.id);
    }

    function handleClick(e) {
        onChange && onChange(e.target.id)
    }

    const range = (start, end, step = 1) => Array.from({ length: (end - start) / step }, (v, k) => (start + k) * step);

    const hours = range(6, 24, 1)
    const minutes = range(1, 60, 15);

    return <>
        <div>{time}</div>
        <table style={{ userSelect: 'none' }}>
            <tbody onClick={handleClick} onMouseOver={handleMouseOver} >
                {hours.map(hour => {
                    const paddedHour = hour.toString().padStart(2, '0');
                    return <tr>
                        <td id={`${paddedHour}:00`}>{hour}</td>
                        {minutes.map(minute => {
                            const paddedMinute = minute.toString().padStart(2, '0');
                            const time = `${paddedHour}:${paddedMinute}`;
                            return <Min key={time} id={time}>{paddedMinute}</Min>
                        })}
                    </tr>
                })}
                <tr>
                    <td></td>
                    {minutes.map(minute => {
                        const paddedMinute = minute.toString().padStart(2, '0');
                        return <td>{paddedMinute}</td>
                    })}
                </tr>
            </tbody>
        </table>
    </>
}
