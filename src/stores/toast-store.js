import { useReducer } from 'react';
import reducer from './toast-reducer';

function toastStore() {

    const [state, dispatch] = useReducer(reducer, new Map());

    const get = (id) => state.get(id);
    const add = (id, { content, expandedContent }) => dispatch({ type: 'add', payload: { id, content, expandedContent } });
    const remove = (id) => dispatch({ type: 'add' });
    const clear = () => dispatch({ type: 'clear' });

    const actions = { get, add, remove, clear }
    return [state, actions]

}

export default toastStore;