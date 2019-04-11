import { useState } from 'react'

function useSolutions() {

    const [state, setState] = useState(new Map());

    const actions = {

        add(id, solution) {
            state.set(id, solution);
            setState(new Map(state))
        },

        delete(id) {
            state.delete(id);
            setState(new Map(state))
        },

        clear() {
            setState(new Map());
        }
    }

    return [state, actions]

}

export default useSolutions;