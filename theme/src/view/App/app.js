import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import Footer from 'src/view/Footer';
import Header from 'src/view/Header';
import Main from 'src/view/Main';
import Navigation from 'src/view/Navigation';
import app from '../..';

import './app.css';

export class App extends Component {
    constructor(props) {
        super(props);

        const reducer = import('src/store/reducers/navigation').then(
            ({ default: r }) => r
        );

        app.addReducer('navigation', reducer);
    }

    render() {
        const { navigation } = this.props;
        const nav = (navigation && navigation.open) || null;

        return (
            <div className="App" data-nav={nav}>
                <Header nav={nav} />
                <Main />
                <Footer />
                <Navigation nav={nav} />
            </div>
        );
    }
}

const mapStateToProps = ({ navigation }) => ({ navigation });

export default connect(mapStateToProps)(App);
