/**
 * Create a `Map` from an iterable object.
 *
 * The second parameter, `getKey`, is used to derive the key for each element.
 * If the elements are key-value pairs, use the `Map` constructor instead.
 *
 * @param {iterable} elements
 * @param {function} getKey
 * @returns {Map}
 */
const toMap = (elements, getKey) => {
    if (elements == null || !elements[Symbol.iterator]) {
        throw new Error('Expected `elements` to be iterable.');
    }

    if (typeof getKey !== 'function') {
        throw new Error('Expected `getKey` to be a function.');
    }

    if (elements instanceof Map) {
        return elements;
    }

    const map = new Map();
    let index = 0;

    for (const element of elements) {
        map.set(getKey(element, index), element);
        index++;
    }

    return map;
};

export default toMap;
