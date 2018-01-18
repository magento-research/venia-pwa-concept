const nconf = require('nconf');
const dotenv = require('dotenv');
const dotEnvFormat = {
  parse: s => {
    const o = dotenv.parse(s);
    Object.keys(o).forEach(key => {
      const val = o[key];
      try {
        o[key] = JSON.parse(val);
      } catch (ignore) {
        // Check for any other well-known strings that should be "parsed"
        if (val === 'undefined'){
          o[key] = void 0;
        }
      }
    });
    return o;
  },
  stringify: require('dotenv-stringify')
};

module.exports = function loadEnv(webpackOverrides) {
    nconf
        .overrides({ store: webpackOverrides })
        .env({ parseValues: true })
        .file('local', { file: '.env', format: dotEnvFormat})
        .file('defaults', { file: '.env.defaults', format: dotEnvFormat})
        .required(['PUBLIC_PATH', 'THEME_PATH']);
    return nconf;
}
