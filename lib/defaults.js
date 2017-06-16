'use strict';

/**
 * Default middleware configuration
 */
module.exports = {

  // Common application errors
  errors: [{
    name: 'BadRequestError',
    message: 'Request malformed.',
    code: 400
  }, {
    name: 'UnauthorizedError',
    message: 'This request requires authentication.',
    code: 401
  }, {
    name: 'ForbiddenError',
    message: 'This request is forbidden.',
    code: 403
  }, {
    name: 'NotFoundError',
    message: 'The requested resource was not found.',
    code: 404
  }, {
    name: 'ConflictError',
    message: 'There is a conflict with another resource with this request.',
    code: 409
  }, {
    name: 'PreconditionFailedError',
    message: 'There is a failed precondition with this request.',
    code: 412
  }, {
    name: 'ImATeapotError',
    message: 'You\'re a teapot.',
    code: 418
  }, {
    name: 'InternalServerError',
    message: 'There was a problem on the server with this request.',
    code: 500
  }],

  // Every failed HTTP request to this urls will be terminated
  exclude: /^\/(assets|api)\//i,

  // Redirection urls
  redirect: {
    error: '/error?err=',
    lost: '/lost?url='
  },

  // Whether to use console.log, a custom debug method or none
  debug: true,

  // Condition to debug an error
  shouldDebug: err => err.code > 399

};
