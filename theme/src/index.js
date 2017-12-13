import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Peregrine from 'peregrine';

import './index.css';

const App = import('src/view/App').then(({ default: App }) => App);
const app = new Peregrine(App);
const container = document.getElementById('root');

app.mount(container);

export default app;
