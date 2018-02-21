import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import defaultClasses from './main.css';

class Main extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    render() {
        const { children, classes } = this.props;

        return <main className={classes.root}>{children}</main>;
    }
}

export default Main;
