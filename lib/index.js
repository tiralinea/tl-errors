'use strict';

const is = require('fi-is');

/**
 * @module fi-errors
 * @version 1.0.0
 * @author Leonardo Ramos <leonardo@finaldevstudio.com>, Santiago G. Marín <santiago@finaldevstudio.com>
 * @copyright Final Development Studio 2017
 * @license MIT
 *
 * @overview This component acts as the very last middleware of an express application. It manages every error may be produced inside any of the previous express middlewares.
 */

/* The component default configuration */
const defaults = require('./defaults');

/**
 * The fi-errors component
 */
const errors = module.exports;

/**
 * Handlers for errors.
 *
 * @type {Object}
 * @private
 */
const handlers = {};

/**
 * Every redirect url.
 *
 * @type {Object}
 * @private
 */
const redirect = {};

/**
 * Every failed HTTP request to this urls will be terminated
 *
 * @type {String}
 * @private
 */
var exclude;

/**
 * Checks if the component has been configured.
 *
 * @type {Boolean}
 * @private
 */
var initialized = {};

/**
 * Debug function reference;
 * @private
 */
var debug = function () {};

/**
 * Function to determine if the module should debug the error.
 *
 * @private
 *
 * @returns {Boolean} Whether to debug.
 */
var shouldDebug = function () {
  return true;
};

/**
 * Builds an error function.
 *
 * @param {Object} options The error definition.
 * @param {String} options.name The error name.
 * @param {String} options.message The error default message.
 * @param {String} options.code The error HTTP response code.
 *
 * @returns {Error} The created custom error.
 */
function buildError(options) {
  var isMalformed = is.empty(options) || is.empty(options.name) ||
    is.empty(options.message) || is.empty(options.code);

  if (isMalformed) {
    throw new Error('Malformed custom error');
  }

  /**
   * Custom Error template.
   *
   * @private
   *
   * @param {String} message The error's message.
   */
  function CustomError(message) {
    Object.defineProperty(this, 'name', {
      enumerable: false,
      writable: false,
      value: options.name || 'CustomError'
    });

    Object.defineProperty(this, 'code', {
      enumerable: false,
      writable: true,
      value: options.code
    });

    Object.defineProperty(this, 'message', {
      enumerable: false,
      writable: true,
      value: message || options.message
    });

    Error.captureStackTrace(this, CustomError);
  }

  Object.setPrototypeOf(CustomError.prototype, Error.prototype);

  return CustomError;
}

/**
 * Define an error property in the component
 *
 * @param {String} name The error name.
 * @param {Function} error The builded error.
 */
function defineError(name, error) {
  Object.defineProperty(errors, name, {
    writable: false,
    value: error
  });
}

/**
 * Builds each custom error.
 *
 * @private
 *
 * @param {Array} errors An array of custom errors.
 */
function loadErrors(errors) {
  errors = errors || [];

  // First load the errors passed by the user.
  errors.forEach(options => {
    let error = buildError(options);
    defineError(options.name, error);
  });

  // Then load the default errors if it's not already loaded.
  defaults.errors.forEach(options => {
    if (!errors[options.name]) {
      let error = buildError(options);
      defineError(options.name, error);
    }
  });
}

/**
 * Register the error handlers where the each key may refer to
 * an error name such as "ValidationError" or an error code as 11000.
 * And the value must refer to a registered error name.
 *
 * @private
 *
 * @param {Object} hdlrs Contains error handlers.
 */
function loadHandlers(hdlrs) {
  hdlrs = hdlrs || {};

  for (let errorNameOrCode in hdlrs) {
    let errorName = hdlrs[errorNameOrCode]; // The name of the error to trigger
    let error = errors[errorName]; // The actual error to trigger.

    if (error) {
      handlers[errorNameOrCode] = error;
    }
  }

}

/**
 * Register the redirection urls.
 *
 * @private
 *
 * @param {Object} redir Contains the error and lost redirection urls.
 */
function loadRedirections(redir) {
  redir = redir || {};

  // First load the redirection urls passed by the user.
  for (let url in redir) {
    redirect[url] = redir[url];
  }

  // Then load the default redirection url if it's not already loaded.
  for (let url in defaults.redirect) {
    if (!redirect[url]) {
      redirect[url] = defaults.redirect[url];
    }
  }
}

/**
 * Register the excluded routes.
 *
 * @private
 *
 * @param {Regex} xclud Every failed HTTP request to this urls will be ended
 * without any redirection.
 */
function loadExclusions(xclud) {
  exclude = xclud || defaults.exclude;
}

/**
 * Resolve the error catched by the handler.
 *
 * @private
 *
 * @param {Error} err The catched error.
 *
 * @returns {Error} A proper error.
 */
function resolveError(err, req) {
  var error;

  // It's an invalid error.
  if (!err || !(err instanceof Error)) {
    error = new errors.InternalServerError();

    error.stack = `${ req.url }: ${ err.stack || error.stack}`;

    return error;
  }

  // It's a registered component error.
  if (errors[err.name]) {
    err.stack = `${ req.url }: ${ err.stack }`;

    return err;
  }

  // It's registered in the handlers with an error name.
  if (handlers[err.name]) {
    error = new handlers[err.name](err.message);

    error.stack = `${ req.url }: ${ err.stack }`;

    return error;
  }

  // It's registered in the handlers with an error code.
  if (handlers[err.code]) {
    error = new handlers[err.code](err.message);

    error.stack = `${ req.url }: ${ err.stack }`;

    return error;
  }

  // It's not a registered error nor a known error handler.
  if (is.not.within(err.code, 99, 600)) {
    err.stack = `${ req.url }: ${ err.stack || 'Stackless'}`;
    err.code = 500;
  }

  return err;
}

/**
 * Register the custom errors list in the application global object.
 *
 * @param {Object} global The application global object.
 * @param {String} attribute The name of the attribute to register in the global object.
 *
 * @returns {Object} The errors component.
 */
function register(global, attribute) {
  if (!initialized) {
    this.configure();
  }

  global[attribute] = errors;

  return this;
}

/**
 * Catches 404s and forwards them to the error handler.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The following middleware.
 */
function notFoundMiddleware(req, res, next) {
  next(new errors.NotFoundError());
}

/**
 * Set proper HTTP status code for custom errors.
 *
 * @param {Error} err The generated error.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The following middleware. Must be declared to access
 * error.
 *
 * @returns {undefined}
 */
function handler(err, req, res, next) { // eslint-disable-line
  err = resolveError(err, req);

  if (shouldDebug(err)) {
    debug(err);
  }

  /* Always assign the error code to the response status */
  res.status(err.code);

  /* If the request is AJAX or matches an excluded path just end the response */
  if (req.xhr || exclude.test(req.path)) {
    return res.end();
  }

  /* Render the lost page if it's a 404 error */
  if (err.code === 404) {
    return res.redirect(redirect.lost + encodeURIComponent(req.originalUrl));
  }

  /* Redirect to error page */
  res.redirect(redirect.error  + encodeURIComponent(err.code));
}

/**
 * Initialize and configure the errors component.
 *
 * @param {Object} cfg The errors configuration object.
 * @param {Array} cfg.errors The custom errors configuration array file.
 * @param {Object} cfg.redirect The default redirect urls.
 * @param {String} cfg.exclude The urls that will end the response if failed.
 * @param {Function} cfg.debug The function to use to debug an error.
 * @param {Function} cfg.shouldDebug The function to call to determine if an
 * error should be debugged.
 *
 * @returns {Object} The errors component.
 */
function config(cfg) {
  cfg = cfg || {};

  loadErrors(cfg.errors);
  loadHandlers(cfg.handlers);
  loadExclusions(cfg.exclude);
  loadRedirections(cfg.redirect);

  /* Set debug method */
  if (is.function(cfg.debug)) {
    debug = cfg.debug;
  } else if (is.boolean(cfg.debug)) {
    debug = console.log.bind(console);
  }
  /* Set should debug method */
  if (is.function(cfg.shouldDebug)) {
    shouldDebug = cfg.shouldDebug;
  }

  initialized = true;

  return this;
}

/* Define component config function */
Object.defineProperty(errors, 'config', {
  writable: false,
  enumerable: false,
  value: config
});

/* Define component register function */
Object.defineProperty(errors, 'register', {
  writable: false,
  enumerable: false,
  value: register
});

/* Define component handler */
Object.defineProperty(errors, 'handler', {
  writable: false,
  enumerable: false,
  value: handler
});

/* Define component not found middleware */
Object.defineProperty(errors, 'notFoundMiddleware', {
  writable: false,
  enumerable: false,
  value: notFoundMiddleware
});

/* Define build error export */
Object.defineProperty(errors, 'buildError', {
  writable: false,
  enumerable: false,
  value: buildError
});
