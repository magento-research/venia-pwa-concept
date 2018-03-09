import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Items from './items';
import Item from './item';
import defaultClasses from './list.css';

const normalizeItems = (items, getKey) =>
    items.reduce((r, v, i) => ({ ...r, [getKey(v, i)]: v }), {});

class List extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        getItemKey: PropTypes.func,
        itemComponent: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.object)
    };

    static defaultProps = {
        getItemKey: ({ key }) => key,
        itemComponent: Item
    };

    render() {
        const { classes, getItemKey, itemComponent, items } = this.props;
        const normalizedItems = normalizeItems(items, getItemKey);

        return (
            <div className={classes.root}>
                <Items itemComponent={itemComponent} items={normalizedItems} />
            </div>
        );
    }
}

export default classify(defaultClasses)(List);
