import { Component, createElement } from 'react';

import Gallery from './gallery';
import data from './mockData';

class Category extends Component {
    render() {
        return (
            <article className="Category">
                <h1 className="Category-title">
                    <span>Dresses</span>
                </h1>
                <section className="Category-hero">
                    <div className="Category-hero-image" />
                </section>
                <section className="Category-gallery">
                    <Gallery data={data} />
                </section>
            </article>
        );
    }
}

export default Category;
