import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

class Tile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { classes, item } = this.props;
        const { description, label } = item;

        return (
            <div className={classes.root} title={description}>
                <span>{label}</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(Tile);
