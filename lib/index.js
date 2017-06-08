'use strict';

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

/* Vars */
const NOT_FOUND_MIDDLEWARE = 'notFoundMiddleware';
const REGISTER = 'register';
const HANDLER = 'handler';
const CONFIG = 'config';
const NL = '\n';

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
 * Builds an error function.
 * 
 * @private
 * @param {Object} options The error definition.
 * @param {String} options.name The error name.
 * @param {String} options.message The error default message.
 * @param {String} options.code The error HTTP response code.
 * 
 * @returns {Function} An error function.
 */
function _buildError(options) {
  if (!options || !options.name || !options.message || !options.code) {
    throw new Error('Malformed custom error');
  }

  /**
   * Create function dinamically
   */
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

/**
 * Define an error property in the component
 * 
 * @param {String} name The error name.
 * @param {Function} error The builded error. 
 */
function _defineErrorPropety(name, error) {

  Object.defineProperty(errors, name, {
    writable: false,
    value: error
  });

}

/**
 * Builds each custom error.
 * 
 * @private
 * @param {Array} _errors An array of custom errors. 
 */
function _loadErrors(_errors) {
  _errors = _errors || [];

  // First load the errors passed by the user.
  _errors.forEach((options) => {
    let error = _buildError(options);
    _defineErrorPropety(options.name, error);
  });

  // Then load the default errors if it's not already loaded.
  defaults.errors.forEach((options) => {
    if (!errors[options.name]) {
      let error = _buildError(options);
      _defineErrorPropety(options.name, error);
    }
  });

}

/**
 * Register the error handlers where the each key may refer to 
 * an error name such as "ValidationError" or an error code as 11000.
 * And the value must refer to a registered error name.
 * 
 * @private
 * @param {Object} _handlers Contains error handlers. 
 */
function _loadHandlers(_handlers) {
  _handlers = _handlers || {};

  for (let errorNameOrCode in _handlers) {
    let errorName = _handlers[errorNameOrCode]; // The name of the error to trigger
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
 * @param {Object} _redirect Contains the error and lost redirection urls. 
 */
function _loadRedirections(_redirect) {
  _redirect = _redirect || {};

  // First load the redirection urls passed by the user.
  for (let url in _redirect) {
    redirect[url] = _redirect[url];
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
 * @param {Regex} _exclude Every failed HTTP request to this urls will be terminated.
 */
function _loadExclusions(_exclude) {
  exclude = _exclude || defaults.exclude;
}

/**
 * Resolve the error catched by the component handler. 
 * 
 * @private
 * @param {Object} error The catched error.
 * @returns A fi-errors registered error.
 */
function _resolveError(error) {
  error = error || {};

  var resolve;

  // Its a registered component error.
  if (errors[error.name]) {
    resolve = error;

    // It's registered in the handlers with an error name.
  } else if (handlers[error.name]) {
    resolve = new handlers[error.name]();

    // It's registered in the handlers with an error code.
  } else if (handlers[error.code]) {
    resolve = new handlers[error.code]();

    // It's not a registered error neither a known error handler.
  } else {
    resolve = new errors.InternalServerError();
  }

  return resolve;

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
 * @param {Function} next The following middleware. Must be declared to access error
 */
function handler(err, req, res, next) { // eslint-disable-line
  err = _resolveError(err);

  // Always log if it's an internal error
  if (err.code === new errors.InternalServerError().code) {
    console.log(NL);
    console.log(new Date());
    console.error(err.stack);
    console.log(NL);
  }

  // Always assign the error code to the response status
  res.status(err.code);

  /** 
   * If the request is an AJAX call or is for an asset or API method
   * just end the response 
   * 
   */
  if (req.xhr || exclude.test(req.path)) {
    return res.end();
  }

  /* If it's a 404 render the lost page */
  if (err.code === new errors.NotFoundError().code) {
    return res.redirect(redirect.lost + encodeURIComponent(req.originalUrl));
  }

  res.redirect(redirect.error);
}

/**
 * Initialize and configure the errors component.
 * 
 * @param {Object} cfg The errors configuration object.
 * @param {Array} cfg.errors The custom errors configuration array file.
 * @param {Object} cfg.redirect The default redirect urls.
 * @param {String} cfg.exclude The urls that if failed will terminate the request.
 * 
 * @returns {Object} The errors component.
 */
function config(cfg) {
  cfg = cfg || {};

  _loadErrors(cfg.errors);
  _loadHandlers(cfg.handlers);
  _loadExclusions(cfg.exclude);
  _loadRedirections(cfg.redirect);

  initialized = true;

  return this;
}

/* Define component config function */
Object.defineProperty(errors, CONFIG, {
  writable: false,
  enumerable: false,
  value: config
});

/* Define component register function */
Object.defineProperty(errors, REGISTER, {
  writable: false,
  enumerable: false,
  value: register
});

/* Define component handler */
Object.defineProperty(errors, HANDLER, {
  writable: false,
  enumerable: false,
  value: handler
});

/* Define component not found middleware */
Object.defineProperty(errors, NOT_FOUND_MIDDLEWARE, {
  writable: false,
  enumerable: false,
  value: notFoundMiddleware
});