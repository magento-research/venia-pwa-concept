/**
 * Utility functions for less verbosely creating test mocks.
 */
module.exports = {};

/**
 *
 * Create a function that assumes its last argument will be a function, and
 * calls it with with an optional error as first argument, and a value as
 * second. This mocks a Node-style async function.
 *
 * Since this is awkward to do inline, we pull it into this utility oneliner.
 *
 * @param {Error} err
 * @param {*} value
 */
module.exports.nodeCb = (err, value) => (...args) => args.pop()(err, value);
