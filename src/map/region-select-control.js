import React, { useState, useEffect } from 'react'
import { DrawingManager } from '@googlemap-react/core';


function addDomListener(event, callback) {
    if (!window.google) return { remove() { } };
    const listener = window.google.maps.event.addDomListener(document, event, callback);
    return {
        remove() { window.google.maps.event.removeListener(listener) }
    }
}

export default function RegionSelectControl({ id, small, title, onSelectionComplete, clearOnComplete = false, color, onClick, active, hidden }) {

    const [shiftKeyDown, setShiftKeyDown] = useState(false);

    useEffect(() => {
        const keydownListener = addDomListener('keydown', handleKeyDown);
        console.log(keydownListener)
        const keyupListener = addDomListener('keyup', handleKeyUp);
        return () => {
            console.log("Cleaned up");
            keydownListener.remove();
            keyupListener.remove();
        }
    }, [window.google]);

    function handleKeyDown(e) {
        if (shiftKeyDown) return;
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 16) {
            setShiftKeyDown(true);
        }
    }

    function handleKeyUp(e) {
        // if (!shiftKeyDown) return;
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 16) {
            setShiftKeyDown(false);
        }
    }

    function handleShapeComplete(shape) {
        console.log(shape);
        clearOnComplete && shape.setMap(null)
        onSelectionComplete && onSelectionComplete(shape);
    }

    const drawingMode = active && shiftKeyDown ? 'rectangle' : null;

    return <>
        <DrawingManager opts={{
            drawingControl: false,
            drawingMode,
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