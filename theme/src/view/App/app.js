import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import app from 'src';
import Page from 'src/view/Page';
import { selectNavigation } from 'src/store/reducers/navigation';
import { extract } from 'src/utils';

export class App extends Component {
    componentDidMount(props) {
        extract(import('src/store/reducers/navigation'))
            .then(reducer => {
                app.addReducer('navigation', reducer);
            })
            .catch(error => {
                throw error;
            });
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
