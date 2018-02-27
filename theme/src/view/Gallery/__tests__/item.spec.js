import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Item from '../item';

configure({ adapter: new Adapter() });

const classes = {
    image: 'a',
    image_pending: 'b',
    images: 'c',
    images_pending: 'd',
    name: 'e',
    name_pending: 'f',
    price: 'g',
    price_pending: 'h',
    root: 'i',
    root_pending: 'j'
};

const validItem = {
    key: 'foo',
    image: 'foo.jpg',
    name: 'Foo',
    price: '$1.00'
};

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 * `showImage` is irrelevant
 */
test('renders a placeholder item while awaiting item', () => {
    const wrapper = shallow(<Item classes={classes} />).dive();

    expect(wrapper.hasClass(classes.root_pending)).toBe(true);
});

test('renders only a placeholder image while awaiting item', () => {
    const wrapper = shallow(<Item classes={classes} />);
    const placeholder = wrapper.first().dive();
    const images = placeholder.find(classes.images_pending);

    expect(images).toHaveLength(placeholder.html());
    // expect(images.first().hasClass(classes.image_pending)).toBe(true);
});

/**
 * STATE 1: awaiting showImage flag
 * `item` is a valid data object
 * `showImage` is `false`
 */
test('renders placeholder and real image when `showImage: false`', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={false} />
    );
    const image = wrapper.find(classes.image);

    expect(image).toHaveLength(2);
    expect(image.first().hasClass(classes.image_pending)).toBe(true);
    expect(image.last().hasClass(classes.image_pending)).toBe(false);
});

test('renders real image even without `onLoad` and `onError`', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={false} />
    );
    const image = wrapper.find(classes.image).last();

    expect(() => image.simulate('load')).not.toThrow();
    expect(() => image.simulate('error')).not.toThrow();
});

test('calls `onLoad` properly on image `load`', () => {
    const handleLoad = jest.fn();
    const wrapper = shallow(
        <Item
            classes={classes}
            item={validItem}
            showImage={false}
            onLoad={handleLoad}
        />
    );

    wrapper
        .find(classes.image)
        .last()
        .simulate('load');

    expect(handleLoad).toBeCalledWith(validItem.key);
});

test('calls `onError` properly on image `error`', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Item
            classes={classes}
            item={validItem}
            showImage={false}
            onError={handleError}
        />
    );

    wrapper
        .find(classes.image)
        .last()
        .simulate('error');

    expect(handleError).toBeCalledWith(validItem.key);
});

/**
 * STATE 2: ready
 * `item` is a valid data object
 * `showImage` is `true`
 */
test('renders only the real image when `showImage: true`', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={true} />
    );
    const image = wrapper.find(classes.image);

    expect(image).toHaveLength(1);
    expect(image.first().hasClass(classes.image_pending)).toBe(false);
});
