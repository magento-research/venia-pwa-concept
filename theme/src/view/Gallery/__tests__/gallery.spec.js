import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Gallery from '../gallery';

configure({ adapter: new Adapter() });

const classes = { root: 'foo' };
const items = [{ key: 'a' }, { key: 'b' }];

test('renders if `data` is an empty array', () => {
    const wrapper = shallow(<Gallery classes={classes} data={[]} />);

    expect(wrapper.hasClass(classes.root)).toBe(true);
});

test('renders if `data` is an array of objects', () => {
    const wrapper = shallow(<Gallery classes={classes} data={items} />);

    expect(wrapper.hasClass(classes.root)).toBe(true);
});
