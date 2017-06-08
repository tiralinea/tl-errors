'use strict';

const path = require('path');
const errors = require(path.join('..', '..', 'lib'));

const {
  PreconditionFailedError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} = errors;

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
   * Internal error request route.
   */
  router.get('/internal-error-request', () => {
    throw new Error();
  });

};