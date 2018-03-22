import normalizeArray from '../normalizeArray';

test('returns an object', () => {
    expect(normalizeArray()).toEqual({});
});

test('transforms an array into an object', () => {
    const input = ['a', 'b'];
    const output = { 0: 'a', 1: 'b' };

    expect(normalizeArray(input)).toEqual(output);
});

test('determines object keys', () => {
    const input = [{ a: 'b' }, { a: 'c' }];
    const output = { b_0: { a: 'b' }, c_1: { a: 'c' } };
    const getKey = ({ a }, i) => `${a}_${i}`;

    expect(normalizeArray(input, getKey)).toEqual(output);
});
