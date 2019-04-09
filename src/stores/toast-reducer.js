function reducer(state, action) {
    console.log(state, action)
    const newState = new Map(state);
    switch (action.type) {
        case 'add': {
            newState.set(action.payload.id, { content: action.payload.content, expandedContent: action.payload.expandedContent })
            break;
        }
        case 'remove': {
            newState.delete(action.payload.id);
            break;
        }
        case 'clear': {
            newState.clear();
            break;
        }
        default: { }
    }
    return newState;
}

export default reducer;