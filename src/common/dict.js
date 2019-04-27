export default function Dict(iterable) {

    const dict = new Map(iterable);

    return {

        get(id) {
            return dict.get(id);
        },

        set(id, value) {
            dict.set(id, value);
        },

        keys() {
            return [...dict.keys()];
        },

        values() {
            return [...dict.values()];
        },

        all() {
            return [...dict.values()];
        },

        get size() {
            return dict.size;
        },

        pluck(property) {
            return [...dict.values()].map(value => value[property]);
        }

    }

}
