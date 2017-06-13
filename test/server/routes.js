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
  code: 123321,
  message: 'The validation failed.'
};

const DB_DUPLICATED_ENTITY_ERROR = {
  name: 'DBDuplicatedEntityError',
  code: 11000,
  message: 'The entity is duplicated.'
};

module.exports = router => {

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
    var ValidationError = errors.buildError(VALIDATION_ERROR);
    throw new ValidationError();
  });

  /**
   * Duplicated entity request route.
   */
  router.get('/duplicated-entity-request', () => {
    var DuplicatedEntityError = errors.buildError(DB_DUPLICATED_ENTITY_ERROR);
    throw new DuplicatedEntityError();
  });

  /**
   * Internal error request route.
   */
  router.get('/internal-error-request', () => {
    throw new Error();
  });

};
