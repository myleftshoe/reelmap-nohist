
export const SET_COLOR = 'APP/CHANGE_COLOR'

export const actions = {
    setColor: (id, color) => {
        console.log(id, color)
        return { type: SET_COLOR, id, color }
    },
}


export default function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case SET_COLOR: {
            const { id, color } = action;
            const driver = state.get(id);
            state.set(id, { ...driver, color })
            break;
        }
        default: { }
    }
    return new Map(state);
}