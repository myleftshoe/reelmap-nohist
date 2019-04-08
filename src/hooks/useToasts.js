import { useReducer } from 'react'

function reducer(state, action) {
    console.log(state, action)
    const newState = new Map(state);
    switch (action.type) {
        case 'add': {
            newState.set(action.payload.id, { content: action.payload.content, expandedContent: action.payload.expandedContent })
            break;
        }
        case 'remove': {
            newState.remove(action.payload.id);
            break;
        }
        case 'clear': {
            newState.clear();
            break;
        }
        default: { }
    }
    console.log(newState)
    return newState;
}

export default function useToasts() {

    const [state, dispatch] = useReducer(reducer, new Map());

    const get = (id) => state.get(id);
    const add = (id, { content, expandedContent }) => dispatch({ type: 'add', payload: { id, content, expandedContent } });
    const remove = (id) => dispatch({ type: 'add' });
    const clear = () => dispatch({ type: 'clear' });

    const actions = { get, add, remove, clear }
    return [state, actions]

}
