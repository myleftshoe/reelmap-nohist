import React from 'react'
import { DrawingManager } from '@googlemap-react/core';
import CustomControlBar from './custom-control-bar';
import useToggle from '../hooks/useToggle';


export default function RegionSelectControl({ id, small, onSelectionComplete, clearOnComplete = false, color, onClick, active }) {
    const [selectMode, toggleSelectMode] = useToggle(false);
    function handleClick(e) {
        if (typeof active === 'boolean')
            onClick && onClick(e)
        else
            toggleSelectMode();
    }
    function handleShapeComplete(shape) {
        console.log(shape);
        clearOnComplete && shape.setMap(null)
        onSelectionComplete && onSelectionComplete(shape);
    }
    const _selectMode = typeof active === 'boolean' ? active : selectMode;

    return <>
        <CustomControlBar.IconButton id={id} small={small} active={_selectMode} onClick={handleClick}>crop_3_2</CustomControlBar.IconButton>
        <DrawingManager opts={{
            drawingControl: false,
            drawingMode: _selectMode ? 'rectangle' : null,
            drawingControlOptions: {
                drawingModes: ['rectangle']
            },
            rectangleOptions: {
                strokeColor: color,
                fillColor: color
            }
        }} onRectangleComplete={handleShapeComplete}
        />
    </>
}