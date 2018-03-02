const dotenv = require('dotenv');
dotenv.config();
const configureBabel = require('./babel.config.js');
const { BuildSession } = require('@magento/pwa-buildpack');

const backendDomain = new URL(process.env.MAGENTO_BACKEND_DOMAIN);

const thisdir = __dirname;

const mode = process.env.NODE_ENV;

module.exports = BuildSession.go({

  `builds with webpack`: `in ${mode}`,

  `frontend is peregrine at ${thisdir}`: {
    symlinkToBackend: false
  },

  `backend is vagrant at ${backendDomain}`: {
    vmName: 'magento2.3'
  }

// }).then(config => {
//   config.module.rules[0].use[0].options = babelOptions;

})