import move from "lodash-move";

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
        case 'move': {
            const { items, fromItem, toItem } = action;
            const fromIndex = items.indexOf(fromItem);
            const toIndex = items.indexOf(toItem);
            fromItem.pinned = true;
            const newItems = move(items, fromIndex, toIndex).map((item, index) => ({ ...item, Sequence: index + 1 }));
            newItems.forEach(item => state.set(item.OrderId, item))
            console.table(newItems, ['OrderId', 'Sequence', 'pinned', 'Street', 'City']);
            break;
        }
        case 'reverse': {
            const newItems = [...action.items].reverse().map((item, index) => ({ ...item, Sequence: index + 1 }));
            newItems.forEach(item => state.set(item.OrderId, item));
            break;
        }
        case 'reorder': {
            action.order.forEach((id, index) => {
                const item = state.get(id);
                state.set(id, { ...item, Sequence: index + 1 })
            });
            break;
        }
        default: { }
    }

    return new Map(state);

}
