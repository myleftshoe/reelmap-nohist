export default function reducer(state, action) {
    console.log('reducing.....', action)
    switch (action.type) {
        case 'assign': {
            action.ids.forEach(id => {
                const item = state.get(id);
                item.Driver = action.driver;
                item.Sequence = null;
            });
            return new Map(state);
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
            return new Map(state);
        }
        case 'update': {
            return new Map(state);
        }
        default:
            throw new Error();
    }
}