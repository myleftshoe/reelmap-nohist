
import { useLayoutEffect, useRef } from 'react'

export default function useGhost() {

    const ref = useRef();
    const parentRef = useRef();

    useLayoutEffect(() => {
        const element = ref.current;
        const parent = parentRef.current;
        if (!element) return;
        console.log(parent)
        // parent.appendChild(element);
        return () => parent.removeChild(element);
    })



    function fromDomNode(e) {
        const { x, y, width, height } = e.target.getBoundingClientRect();
        const { x: mx, y: my } = e;
        console.log(mx, my)
        ref.current = e.target.cloneNode(e.target);
        parentRef.current = e.target.parentNode;
        console.log(parentRef.current)
        console.log(ref.current)
        const crt = ref.current;
        // crt.style.backgroundColor = "red";
        // crt.style.border = '1px dotted white';
        crt.style.color = "white";
        crt.style.height = `${height}px`;
        crt.style.width = `${width}px`;
        crt.style.position = "absolute";
        crt.style.top = "0";
        crt.style.left = "0";
        crt.style.zIndex = "-1";
        console.log(x, y, width, height)
        parentRef.current.appendChild(crt);
        e.dataTransfer.setDragImage(crt, mx - x, my - y);

        // setTimeout(function () {
        //     crt.parentNode.removeChild(crt);
        // }, 1000);

    }

    return fromDomNode;
}
