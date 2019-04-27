

export default function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case 'set-color': {
            const { id, color } = action;
            const driver = state.get(id);
            state.set(id, { ...driver, color })
            break;
        }
        default: { }
    }
    return new Map(state);
}