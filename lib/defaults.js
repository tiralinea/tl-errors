'use strict';

/**
 * Default middleware configuration
 */
module.exports = {

  // Common application errors
  errors: [

    {
      name: 'BadRequestError',
      message: 'Request malformed.',
      code: 400
    },

    {
      name: 'UnauthorizedError',
      message: 'This request requires authentication.',
      code: 401
    },

    {
      name: 'ForbiddenError',
      message: 'This request is forbidden.',
      code: 403
    },

    {
      name: 'NotFoundError',
      message: 'The requested route was not found.',
      code: 404
    },

    {
      name: 'PreconditionFailedError',
      message: 'There is a failed precondition with this request.',
      code: 412
    },

    {
      name: 'InternalServerError',
      message: 'Something went bad in the server.',
      code: 500
    }

  ],

  // Every failed HTTP request to this urls will be terminated 
  exclude: /^\/(assets|api)\//i,

  // Redirection urls
  redirect: {
    error: '/error?err=',
    lost: '/lost?url='
  },

  globalRegisterName: 'Errors'

};
