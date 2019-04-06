import React, { useEffect } from 'react'
import { toast, Bounce, Slide, Flip, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Solution from '../components/solution';
import './useToast.css';

toast.configure({
    position: toast.POSITION.BOTTOM_LEFT,
    transition: Bounce,
    autoClose: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnVisibilityChange: true,
    draggable: true,
})

export default function useToast(solutions) {
    function showToast() {
        if (solutions.length) {
            const { distance, duration, service } = solutions[0].summary;
            toast.success(<Solution distance={distance} duration={duration} service={service} />, {
                className: 'shrink-font-size',
                // bodyClassName: 'shrink-font-size',
                // progressClassName: 'fancy-progress-bar'
            });
            // state.setSolution(null);
        }
    }
    useEffect(showToast, [solutions]);
}
