import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import defaultClasses from './footer.css';

class Footer extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            tile: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    render() {
        const { classes } = this.props;

        return (
            <footer className={classes.root}>
                <div className={classes.tile}>
                    <h2>
                        <span>Your Account</span>
                    </h2>
                    <p>
                        <span>
                            Sign up and get access to our wonderful rewards
                            program.
                        </span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2>
                        <span>Follow Us On Instagram</span>
                    </h2>
                    <p>
                        <span>
                            See what the Rush Tribe is up to, and add your
                            stories to the mix.
                        </span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2>
                        <span>Store Locator</span>
                    </h2>
                    <p>
                        <span>
                            Find the one closest to you from over 1200 locations
                            worldwide.
                        </span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2>
                        <span>Customer Support</span>
                    </h2>
                    <p>
                        <span>Call us, chat, email us, FAQs and more.</span>
                    </p>
                </div>
            </footer>
        );
    }
}

export default Footer;
