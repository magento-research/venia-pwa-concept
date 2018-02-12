import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Item from '../item';

configure({ adapter: new Adapter() });

const validItem = {
    key: 'foo',
    image: 'foo.jpg',
    name: 'Foo',
    price: '$1.00'
};

test('throws if `placeholder` is falsy and item is invalid', () => {
    expect(() => shallow(<Item />)).toThrow();
    expect(() => shallow(<Item item={null} />)).toThrow();
});

test('renders if item is an empty object', () => {
    expect(() => shallow(<Item item={{}} />)).not.toThrow();
});

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 * `showImage` is irrelevant
 */
test('renders a placeholder item', () => {
    const wrapper = shallow(<Item placeholder={true} />);

    expect(wrapper.hasClass('gallery-item')).toBe(true);
    expect(wrapper.prop('data-placeholder')).toBe(true);
});

test('renders only a placeholder image in `STATE 0`', () => {
    const wrapper = shallow(<Item placeholder={true} />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(1);
    expect(images.first().prop('data-placeholder')).toBe(true);
});

/**
 * STATE 1: awaiting showImage flag
 * `item` is a valid data object
 * `showImage` is `false`
 */
test('renders both placeholder and real images in `STATE 1`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={false} />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(2);
    expect(images.first().prop('data-placeholder')).toBe(true);
    expect(images.last().prop('data-placeholder')).toBe(void 0);
});

test('renders without `onLoad` and `onError`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={false} />);
    const image = wrapper.find('.gallery-item-image').last();

    expect(() => image.simulate('load')).not.toThrow();
    expect(() => image.simulate('error')).not.toThrow();
});

test('calls `onLoad` properly on image `load`', () => {
    const handleLoad = jest.fn();
    const wrapper = shallow(
        <Item item={validItem} showImage={false} onLoad={handleLoad} />
    );

    wrapper
        .find('.gallery-item-image')
        .last()
        .simulate('load');

    expect(handleLoad).toBeCalledWith(validItem.key);
});

test('calls `onError` properly on image `error`', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Item item={validItem} showImage={false} onError={handleError} />
    );

    wrapper
        .find('.gallery-item-image')
        .last()
        .simulate('error');

    expect(handleError).toBeCalledWith(validItem.key);
});

/**
 * STATE 2: ready
 * `item` is a valid data object
 * `showImage` is `true`
 */
test('renders only the real image in `STATE 2`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={true} />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(1);
    expect(images.first().prop('data-placeholder')).toBe(void 0);
});
