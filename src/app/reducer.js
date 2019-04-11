export default function reducer(state, action) {

    console.log('reducing.....', action)

    switch (action.type) {
        case 'assign': {
            action.ids.forEach(id => {
                const item = state.get(id);
                item.Driver = action.driver;
                item.Sequence = null;
            });
            break;
        }
        case 'swap-route': {
            const { from, to } = action;
            [...state.values()].forEach(item => {
                if (item.Driver === from) {
                    item.Driver = to;
                }
                else if (item.Driver === to) {
                    item.Driver = from;
                }
            });
            break;
        }
        case 'set': {
            state = new Map(action.state);
            break;
        }
        default: { }
    }

    return new Map(state);

}
