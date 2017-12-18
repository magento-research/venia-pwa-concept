import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import Page from 'src/view/Page';
import { selectNavigation } from 'src/store/reducers/navigation';
import { extract } from 'src/utils';
import app from '../..';

export class App extends Component {
    componentDidMount(props) {
        const reducer = extract(import('src/store/reducers/navigation'));

        app.addReducer('navigation', reducer);
    }

    render() {
        const nav = this.props.navigation.open || null;

        return <Page nav={nav} />;
    }
}

const mapStateToProps = state => ({
    navigation: selectNavigation(state)
});

export default connect(mapStateToProps)(App);
