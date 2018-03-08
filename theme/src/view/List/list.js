import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Items from './items';
import Item from './item';
import defaultClasses from './list.css';

class List extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    static defaultProps = {
        itemComponent: Item
    };

    render() {
        const { classes, itemComponent, items } = this.props;

        return (
            <div className={classes.root}>
                <Items itemComponent={itemComponent} items={items} />
            </div>
        );
    }
}

export default classify(defaultClasses)(List);
