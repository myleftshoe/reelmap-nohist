export default function mapMove(mapObj, fromKey, toKey) {

    const _mapObj = new Map(mapObj);

    const toValue = _mapObj.get(toKey);
    const fromValue = _mapObj.get(fromKey);

    if (!toValue || !fromValue) return mapObj;

    _mapObj.set(toKey, fromValue);
    _mapObj.set(fromKey, toValue);

    return _mapObj;

}
