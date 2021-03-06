'use strict';

/**
 * fi-errors configuration
 */
module.exports = {
  /**
   * Application custom errors
   */
  errors: [],

  /**
   * Application custom error handlers
   */
  handlers: {
    /* Handle validations errors with BadRequestError */
    ValidationError: 'BadRequestError',

    /* Handle errors with code 11000 with MongoDuplicatedError. */
    '11000': 'ConflictError'
  },

  /* Whether to use console.log, a custom debug method or none */
  debug: true,

  /* Condition to debug an error */
  shouldDebug: () => true
};
