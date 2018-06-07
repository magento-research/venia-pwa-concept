import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import toMap from 'src/util/toMap';
import Product from './product';
import mockData from './mockData';
import defaultClasses from './minicart.css';

class MiniCart extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    static defaultProps = {
        // TODO: remove when connected to graphql
        data: toMap(mockData, v => [v.id, v])
    }

    render() {
        const { classes, data } = this.props;
        const iconDimensions = { height: 16, width: 16 };

        return (
            <aside className={classes.root}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Shopping Cart</span>
                    </h2>
                    <button className={classes.trigger}>
                        <Icon name="x" />
                    </button>
                </div>
                <div className={classes.summary}>
                    <dl className={classes.totals}>
                        <dt className={classes.subtotalLabel}>
                            Subtotal (4 Items)
                        </dt>
                        <dd className={classes.subtotalValue}>$528.00</dd>
                    </dl>
                </div>
                <div className={classes.cta}>
                    <Button>
                        <Icon name="lock" attrs={iconDimensions} />
                        <span>Checkout</span>
                    </Button>
                </div>
            </aside>
        );
    }
}

export default classify(defaultClasses)(MiniCart);
