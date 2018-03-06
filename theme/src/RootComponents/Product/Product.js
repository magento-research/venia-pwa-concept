import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import RichText from 'src/view/RichText';
import mockData from './mockData';
import defaultClasses from './product.css';

class Product extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        data: PropTypes.shape({
            Description: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.string
        })
    };

    static defaultProps = {
        data: mockData
    };

    render() {
        const { classes, data } = this.props;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <span>{data.name}</span>
                </h1>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <span>Product Description</span>
                    </h2>
                    <RichText content={data.description} />
                </section>
            </article>
        );
    }
}

export default classify(defaultClasses)(Product);
