import React, { useState } from 'react'
import styled from '@emotion/styled';
import 'tippy.js/themes/light.css'
import Tooltip from '@tippy.js/react'


const colors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300BE']

const Colors = styled.div`
    display: flex;
    cursor: pointer;
    user-select: none;
`

const Color = styled.div`
    height:10px;
    width:10px;
    background-color: ${props => props.color};
    border: 1px solid black;
    margin: 0px 4px;
`

const PickerColor = styled.div`
    height: 16px;
    width: 16px;
    background-color: ${props => props.color};
    /* border: 1px solid black; */
    margin: 2px;
    margin-top: 3px;
`

const Palette = props => <Colors>{colors.map(color => <PickerColor onClick={() => props.onChange(color)} key={color} color={color} />)}</Colors>

function ColorPicker({ color, onChange }) {
    const [open, setOpen] = useState(false);
    function handleChange(color) {
        console.log(color)
        setOpen(false)
        onChange && onChange(color)
    }
    return <>
        <Tooltip
            theme='light'
            arrow
            isVisible={open}
            interactive
            content={<Palette onChange={handleChange} />}
            onHidden={() => setOpen(false)}
        >
            <Color color={color} onClick={() => setOpen(true)}></Color>
        </Tooltip>
    </>
}

export default ColorPicker