'use strict';

/**
 * Component test configuration.
 */
module.exports = {
  tests: 'test/tests.js',

  server: {
    url: 'http://localhost',
    port: 9191
  },

  mocha: {
    bail: true
  }
};
