'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');
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

mongoose.Promise = Promise;

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
  router.get('/validation-failed-request', (req, res, next) => {
    mongoose.connect(`mongodb://localhost/${ uuid.v4() }`)

      .then(() => {
        var Model = mongoose.model('validation', new mongoose.Schema({
          value: {
            type: Number,
            required: true
          }
        }));

        var data = {
          value: 'NOT A NUMBER'
        };

        return Model.ensureIndexes().then(() => Model.create(data)
          .then(() => Model.create(data)));
      })

      .catch(err => mongoose.connection.db.dropDatabase()
        .then(() => mongoose.disconnect())
        .then(() => next(err)));
  });

  /**
   * Duplicated entity request route.
   */
  router.get('/duplicated-entity-request', (req, res, next) => {
    mongoose.connect(`mongodb://localhost/${ uuid.v4() }`)

      .then(() => {
        var Model = mongoose.model('uniqueness', new mongoose.Schema({
          value: {
            type: String,
            unique: true
          }
        }));

        var data = {
          value: 'NOT UNIQUE'
        };

        return Model.ensureIndexes().then(() => Model.create(data)
          .then(() => Model.create(data)));
      })

      .catch(err => mongoose.connection.db.dropDatabase()
        .then(() => mongoose.disconnect())
        .then(() => next(err)));
  });

  /**
   * Internal error request route.
   */
  router.get('/internal-error-request', () => {
    throw new Error();
  });

  /**
   * Invalid error request route.
   */
  router.get('/invalid-error-request', () => {
    throw 'wer';
  });

};
