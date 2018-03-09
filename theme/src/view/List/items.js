import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Item from './item';

class Items extends Component {
    static propTypes = {
        itemComponent: PropTypes.func,
        items: PropTypes.objectOf(PropTypes.object)
    };

    static defaultProps = {
        itemComponent: Item
    };

    render() {
        const { itemComponent: ItemComponent, items } = this.props;

        return Object.entries(items).map(([key, item]) => (
            <ItemComponent key={key} item={item} />
        ));
    }
}

export default Items;
