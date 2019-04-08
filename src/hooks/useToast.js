import { useEffect } from 'react'
import { toast, Bounce, Slide, Flip, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

export default function useToast({ id, content }) {
    if (!id) return;
    function showToast() {
        toast.success(content, {
            toastId: id,
            className: 'shrink-font-size',
            // bodyClassName: 'shrink-font-size',
            // progressClassName: 'fancy-progress-bar'
        });
        // state.setSolution(null);
    }
    useEffect(showToast, [id]);
}
