import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import List from 'src/view/List';
import Swatch from './swatch';
import defaultClasses from './swatchList.css';

class SwatchList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        itemComponent: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        return <List itemComponent={Swatch} {...this.props} />;
    }
}

export default classify(defaultClasses)(SwatchList);
