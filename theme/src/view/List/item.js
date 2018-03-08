import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './item.css';

class Item extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { classes } = this.props;

        return <span className={classes.root} />;
    }
}

export default classify(defaultClasses)(Item);
