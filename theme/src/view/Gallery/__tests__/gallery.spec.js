import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Gallery from '../gallery';

configure({ adapter: new Adapter() });

const items = [{ key: 'a' }, { key: 'b' }];

test('renders if `data` is falsy', () => {
    expect(() => shallow(<Gallery />)).not.toThrow();
    expect(() => shallow(<Gallery data={null} />)).not.toThrow();
});

test('renders if `data` is an empty array', () => {
    expect(() => shallow(<Gallery data={[]} />)).not.toThrow();
});

test('renders if `data` is an array of objects', () => {
    expect(() => shallow(<Gallery data={items} />)).not.toThrow();
});
