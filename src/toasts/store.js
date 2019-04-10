import { useReducer, useRef } from 'react';
import reducer from './reducer';

function toastStore() {

    const [state, dispatch] = useReducer(reducer, new Map());
    const callbacks = useRef({});

    const get = (id) => state.get(id);
    const add = (id, { content, expandedContent }) => dispatch({ type: 'add', payload: { id, content, expandedContent } });
    const remove = (id) => {
        dispatch({ type: 'remove', payload: { id } });
        callbacks.current.onRemove && callbacks.current.onRemove(id)
    }
    const clear = () => {
        dispatch({ type: 'clear' });
        callbacks.current.onClear && callbacks.current.onClear()
    }
    const select = (id) => {
        callbacks.current.onSelect && callbacks.current.onSelect(id)
    }
    const onRemove = callback => callbacks.current.onRemove = callback;
    const onClear = callback => callbacks.current.onClear = callback;
    const onSelect = callback => callbacks.current.onSelect = callback;

    const actions = { get, add, remove, clear, select, onRemove, onClear, onSelect }

    return [state, actions]
}

export default toastStore;
