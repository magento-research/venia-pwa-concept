import extract from '../extract';

// mock dynamic imports
async function dynamicImport() {
    return { foo: 'foo', default: 'bar' };
}

test('retrieves a named export', async () => {
    const foo = await extract(dynamicImport(), 'foo');

    expect(foo).toBe('foo');
});

test('retrieves the default export', async () => {
    const bar = await extract(dynamicImport());

    expect(bar).toBe('bar');
});

test('throws if the module fails to resolve', () => {
    const error = new Error('Invalid namespace object provided.');

    return expect(extract(null)).rejects.toEqual(error);
});

test('throws if the binding is not present', () => {
    const error = new Error('Binding baz not found.');

    return expect(extract(dynamicImport(), 'baz')).rejects.toEqual(error);
});
