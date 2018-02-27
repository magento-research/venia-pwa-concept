import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import app from 'src';
import Category from 'src/RootComponents/Category';
import Page from 'src/view/Page';
import { selectNavigation } from 'src/store/reducers/navigation';
import { extract } from 'src/utils';

import defaultClasses from './app.css';

export class App extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            promo: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    componentDidMount() {
        extract(import('src/store/reducers/navigation'))
            .then(reducer => {
                app.addReducer('navigation', reducer);
            })
            .catch(error => {
                throw error;
            });
    }

    render() {
        const { classes, navigation } = this.props;
        const nav = navigation.open || null;

        return (
            <Page nav={nav}>
                <div className={classes.promo}>
                    Free shipping on our new arrivals! Enter the promo code NEW
                    at checkout!
                </div>
                <Category />
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    navigation: selectNavigation(state)
});

export default connect(mapStateToProps)(App);
