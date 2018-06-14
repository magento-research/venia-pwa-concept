import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import Main from 'src/components/Main';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';

import classify from 'src/classify';
import defaultClasses from './page.css';

class Page extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            masked: PropTypes.string,
            root: PropTypes.string
        }),
        nav: PropTypes.bool
    };

    render() {
        const { children, classes, nav } = this.props;
        const className = nav ? classes.masked : classes.root;

        return (
            <div className={className}>
                <Header />
                <Main>{children}</Main>
                <Footer />
                <Navigation nav={nav} />
                <MiniCart />
            </div>
        );
    }
}

export default classify(defaultClasses)(Page);
