import toMap from '../toMap';

const identity = v => v;

test('throws if `items` is not iterable', () => {
    const message = 'Expected `elements` to be iterable.';
    const withUndefined = () => {
        toMap();
    };
    const withObject = () => {
        toMap({}, identity);
    };

    expect(withUndefined).toThrow(message);
    expect(withObject).toThrow(message);
});

test('throws if `getKey` is not a function', () => {
    const message = 'Expected `getKey` to be a function.';
    const withUndefined = () => toMap([]);
    const withTrue = () => toMap([], true);

    expect(withUndefined).toThrow(message);
    expect(withTrue).toThrow(message);
});

test('returns `elements` if it is already a map', () => {
    const input = new Map();

    expect(toMap(input, identity)).toBe(input);
});

test('creates a `Map` from an array', () => {
    const input = ['a', 'b'];
    const output = new Map().set(input[0], input[0]).set(input[1], input[1]);

    expect(toMap(input, identity)).toEqual(output);
});

test('uses `getKey` to derive keys', () => {
    const getKey = ({ a }, i) => `${a}_${i}`;
    const input = [{ a: 'b' }, { a: 'c' }];
    const output = new Map()
        .set(getKey(input[0], 0), input[0])
        .set(getKey(input[1], 1), input[1]);

    expect(toMap(input, getKey)).toEqual(output);
});
