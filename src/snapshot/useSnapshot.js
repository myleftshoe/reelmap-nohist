import { useReducer } from 'react'
import reducer from './reducer'

function useSnapshot() {

    const [state, dispatch] = useReducer(reducer, new Map());

    const actions = {

        add(id, state) {
            dispatch({ type: 'add', id, state })
        },

        delete(id) {
            dispatch({ type: 'delete', id })
        },

        clear() {
            dispatch({ type: 'clear' })
        },

        get(id) {
            console.log('rrrrrrrrrrrrrrrrrr', id);
            console.log(state.get(id))
            return JSON.parse(state.get(id));
        }
    }

    return [state, actions]

}

export default useSnapshot;