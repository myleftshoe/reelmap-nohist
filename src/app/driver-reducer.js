

export default function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case 'set-color': {
            const { id, color } = action;
            const driver = state.get(id);
            state.set(id, { ...driver, color })
            break;
        }
        case 'set-start': {
            const { id, seconds } = action;
            const driver = state.get(id);
            state.set(id, { ...driver, start: seconds })
            break;
        }
        case 'set-end': {
            const { id, seconds } = action;
            const driver = state.get(id);
            state.set(id, { ...driver, end: seconds })
            break;
        }
        default: { }
    }
    return new Map(state);
}