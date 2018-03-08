import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Item from './item';

class Items extends Component {
    static propTypes = {
        getKey: PropTypes.func
    };

    static defaultProps = {
        getKey: ({ key }) => key,
        itemComponent: Item
    };

    render() {
        const { getKey, itemComponent: ItemComponent, items } = this.props;

        return items.map((item, index) => {
            const key = getKey(item, index);

            return <ItemComponent key={key} item={item} />;
        });
    }
}

export default Items;
