'use strict';

/**
 * @module fi-errors
 * @version 1.0.0
 * @author Leonardo Ramos <leonardo@finaldevstudio.com>, Santiago G. Marín <santiago@finaldevstudio.com>
 * @copyright Final Development Studio 2017
 * @license MIT
 * 
 * @overview This component acts as the very last middleware of an express application. It manages every error may be produced inside any of the previous express middlewares.  
 **/

const defaults = require('./defaults');

const NL = '\n';

/**
 * Every custom error function.
 * 
 * @type {Object}
 * @private
 */
const errors = {};

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
  var error = new Function(
    `return function ${options.name}(message) { 
      this.name = "${options.name}";
      this.code = "${options.code}";
      this.message = message || "${options.message}";
      this.stack = (new Error()).stack;
    };`)();

  // Chain object constructor
  error.prototype = Object.create(Error.prototype);
  error.prototype.constructor = error;

  return error;
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
    errors[options.name] = error;
  });

  // Then load the default errors if it's not already loaded.
  defaults.errors.forEach((options) => {
    if (!errors[options.name]) {
      let error = _buildError(options);
      errors[options.name] = error;
    }
  });

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
 * @param {Regex} _exclude Every failed HTTP request to this urls will be terminated  
 */
function _loadExclusions(_exclude) {
  exclude = _exclude || defaults.exclude;
}

/**
 * Catches 404s and forwards them to the error handler.
 * 
 * @private
 * @param {Object} req The request object. 
 * @param {Object} res The response object.
 * @param {Function} next The following middleware.
 */
function _notFoundErrorHandler(req, res, next) {
  next(new errors.NotFoundError());
}

/**
 * Set proper HTTP status code for custom errors. 
 * 
 * @private
 * @param {Error} err The generated error.
 * @param {Object} req The request object. 
 * @param {Object} res The response object.
 * @param {Function} next The following middleware. Must be declared to access error
 */
function _customErrorHandler(err, req, res, next) { // eslint-disable-line
  err = (err && err.code) ? err : new errors.InternalServerError();

  res.status(err.code);

  // Always log if it's an internal error
  if (err.code === new errors.InternalServerError().code) {
    console.log(NL);
    console.log(new Date());
    console.error(err.stack);
    console.log(NL);
  }

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

module.exports = {

  /**
   * Initialize and configure the errors component.
   * 
   * @param {Object} config The errors configuration object.
   * @param {Array} config.errors The custom errors configuration array file.
   * @param {Object} config.redirect The default redirect urls.
   * @param {String} config.exclude The urls that if failed will terminate the request.
   * 
   * @returns {Object} The errors component.
   */

  configure: function configure(config) {
    config = config || {};

    _loadErrors(config.errors);
    _loadExclusions(config.exclude);
    _loadRedirections(config.redirect);

    initialized = true;

    return this;
  },

  /**
   * Bind the errors component to the express aplication.
   * 
   * @param {Express} app The express application.
   * 
   * @returns {Object} The errors component.
   */
  bind: function bind(app) {
    if (!initialized) {
      this.configure();
    }

    app.use(_notFoundErrorHandler);
    app.use(_customErrorHandler);

    return this;
  },

  /**
   * Returns the component errors list.
   * 
   * @returns {Object} Every registered error.
   */
  list: function list() {
    if (!initialized) {
      this.configure();
    }

    return errors;
  },

  /**
   * Register the custom errors list in the application global object.
   * 
   * @param {Object} global The application global object.
   * @param {String} attribute The name of the attribute to register in the global object.
   * 
   * @returns {Object} The errors component.
   */
  register: function register(global, attribute) {
    if (!initialized) {
      this.configure();
    }

    global[attribute] = errors;

    return this;
  }

};