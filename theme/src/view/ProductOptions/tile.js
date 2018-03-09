import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

class Tile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.shape({
            description: PropTypes.string,
            label: PropTypes.string
        })
    };

    render() {
        const { classes, item } = this.props;
        const { description, label } = item;

        return (
            <button
                className={classes.root}
                title={description}
                onClick={this.handleClick}
            >
                <span>{label}</span>
            </button>
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Tile);
