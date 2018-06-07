import { Component, Fragment, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
// import defaultClasses from './minicart.css';

class Product extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    get options() {
        const { product } = this.props;

        return product.options.map(({ name, value }) => (
            <Fragment key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
            </Fragment>
        ));
    }

    render() {
        const { options, props } = this;
        const { classes, product } = props;

        return (
            <li>
                <div />
                <div className={classes.name}>
                    {product.name}
                </div>
                <dl>
                    {options}
                </dl>
            </li>
        );
    }
}

export default classify({})(Product);
