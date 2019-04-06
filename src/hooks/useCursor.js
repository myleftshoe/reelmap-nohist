import { circle } from '../svg/cursors'

export default function useCusror({shape, color, label}) {
    return shape ? circle({ radius: 10, color, text:label }).cursor : null;
}