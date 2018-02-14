import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import cheerio from 'cheerio';

import Items, { emptyData } from '../items';

// use cheerio directly rather than enzyme
// since enzyme doesn't support React Fragment yet
// see https://github.com/airbnb/enzyme/issues/1213
const render = element => cheerio.load(renderToStaticMarkup(element));

// mock all console methods
beforeAll(() => {
    for (const method of Object.keys(console)) {
        jest.spyOn(console, method).mockImplementation(() => {});
    }
});

// restore all console methods
afterAll(() => {
    for (const method of Object.keys(console)) {
        jest.spyOn(console, method).mockImplementation(() => {});
    }
});

// create an array of empty objects with keys
const items = Array.from({ length: 3 }, (_, key) => ({ key, item: {} }));

test('emptyData contains only nulls', () => {
    expect(emptyData.every(v => v === null)).toBe(true);
});

test('throws if `items` is not an array', () => {
    expect(() => render(<Items />)).toThrow();
    expect(() => render(<Items items={null} />)).toThrow();
});

test('renders if items is an empty array', () => {
    const wrapper = render(<Items items={[]} />);

    expect(wrapper.text()).toBe('');
});

test('renders an array of items', () => {
    const wrapper = render(<Items items={items} />);

    expect(wrapper('.gallery-item')).toHaveLength(3);
});

test('renders placeholder items', () => {
    const wrapper = render(<Items items={emptyData} />);

    expect(wrapper('.gallery-item[data-placeholder="true"]')).toHaveLength(
        emptyData.length
    );
});
