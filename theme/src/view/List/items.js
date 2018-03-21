import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import ListItem from './item';

class Items extends Component {
    static propTypes = {
        items: PropTypes.objectOf(PropTypes.object)
    };

    render() {
        const { items, renderItem } = this.props;

        return Object.entries(items).map(([key, item]) => (
            <ListItem key={key} render={renderItem} item={item} />
        ));
    }
}

export default Items;
