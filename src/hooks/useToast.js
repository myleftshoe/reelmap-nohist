import React, { useEffect } from 'react'
import { toast, Bounce, Slide, Flip, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Solution from '../components/solution';
import './useToast.css';

toast.configure({
    position: toast.POSITION.BOTTOM_LEFT,
    transition: Bounce,
    // autoClose: 5000,
    newestOnTop: false,
    closeOnClick: true,
    pauseOnVisibilityChange: true,
    draggable: true,
})

export default function useToast(id, solution, onButtonClick) {
    function showToast() {
        if (solution) {
            const { distance, duration, service } = solution.summary;
            toast.success(<Solution distance={distance} duration={duration} service={service} onButtonClick={() => onButtonClick(id)} />, {
                toastId: id,
                className: 'shrink-font-size',
                // bodyClassName: 'shrink-font-size',
                // progressClassName: 'fancy-progress-bar'
            });
            // state.setSolution(null);
        }
    }
    useEffect(showToast, [id]);
}
