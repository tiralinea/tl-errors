'use strict';

const path = require('path');
const errors = require(path.join('..', '..', 'lib'));

const {
  PreconditionFailedError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} = errors;

const VALIDATION_ERROR = {
  name: 'ValidationError',
  code: '123321',
  message: 'The validation failed.'
};

const DUPLICATED_ENTITY_ERROR = {
  name: 'DuplicatedEntityError',
  code: '11000',
  message: 'The entity is duplicated.'
};

function createError(options) {
  var error = function (message) {
    this.name = options.name;
    this.code = options.code;
    this.message = message || options.message;
    this.stack = (new Error()).stack;
  };

  // Chain object constructor
  error.prototype = Object.create(Error.prototype);
  error.prototype.constructor = error;

  return error;
}

module.exports = (router) => {

  /**
   * Server entry point route.
   */
  router.get('/', (req, res) => {
    res.end();
  });

  /**
   * Bad request route.
   */
  router.get('/bad-request', () => {
    throw new BadRequestError();
  });

  /**
   * Unauthorized request route.
   */
  router.get('/unauthorized-request', () => {
    throw new UnauthorizedError();
  });

  /**
   * Forbidden request route.
   */
  router.get('/forbidden-request', () => {
    throw new ForbiddenError();
  });

  /**
   * Failed precondition request route.
   */
  router.get('/failed-precondition-request', () => {
    throw new PreconditionFailedError();
  });

  /**
   * Validation failed request route.
   */
  router.get('/validation-failed-request', () => {
    var error = createError(VALIDATION_ERROR);
    throw new error();
  });

  /**
   * Duplicated entity request route.
   */
  router.get('/duplicated-entity-request', () => {
    var error = createError(DUPLICATED_ENTITY_ERROR);
    throw new error();
  });

  /**
   * Internal error request route.
   */
  router.get('/internal-error-request', () => {
    throw new Error();
  });

};