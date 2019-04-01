import React from 'react'
import { DrawingManager } from '@googlemap-react/core';
import CustomControlBar from './custom-control-bar';
import useToggle from '../hooks/useToggle';


export default function RegionSelectControl({ small, onSelectionComplete, clearOnComplete = false }) {
    const [selectMode, toggleSelectMode] = useToggle(false);
    function handleShapeComplete(shape) {
        console.log(shape);
        clearOnComplete && shape.setMap(null)
        onSelectionComplete && onSelectionComplete(shape);
    }
    return <>
        <CustomControlBar.IconButton small={small} onClick={toggleSelectMode}>crop_3_2</CustomControlBar.IconButton>
        <DrawingManager opts={{
            drawingControl: false,
            drawingMode: selectMode ? 'rectangle' : null,
            drawingControlOptions: {
                drawingModes: ['rectangle']
            },
        }} onRectangleComplete={handleShapeComplete}
        />
    </>
}