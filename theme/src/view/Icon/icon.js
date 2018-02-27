import { Component, createElement } from 'react';
import Feather from 'feather-icons';
import PropTypes from 'prop-types';

import defaultClasses from './icon.css';

class Icon extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    render() {
        const { classes, name } = this.props;
        const svg = Feather.icons[name].toSvg();
        const fn = () => ({ __html: svg });

        return <span className={classes.root} dangerouslySetInnerHTML={fn()} />;
    }
}

export default Icon;
