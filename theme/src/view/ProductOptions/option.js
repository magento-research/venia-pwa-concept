import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import TileList from './tileList';
import defaultClasses from './option.css';

class Option extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        name: PropTypes.node,
        values: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        const { classes, name, values } = this.props;

        return (
            <div className={classes.root}>
                <h3>
                    <span>{name}</span>
                </h3>
                <TileList items={values} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Option);
