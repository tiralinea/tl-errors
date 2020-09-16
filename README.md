# TL Errors

An [ExpressJS](http://expressjs.com) middleware to handle custom errors.

### Requirements:
* NodeJS 6.x.x

### Installation

```sh
npm install --save tl-errors
```

### Configuration

The first step is to create your configuration file. Here you can define your custom errors, redirection urls and excluded requests.

This package comes with a [default configuration](lib/defaults.js) that you can extend or overwrite.

#### Sample configuration file
```javascript
const config = {
  // Custom application errors
  errors: [
    // This error will be added to the component errors list
    {
      name: 'EnhanceYourCalmError',
      message: 'Breath in... Breath out...'
      code: 420
    },

    // These errors will overwrite the default errors with new messages
    {
      name: 'BadRequestError',
      message: 'The request could not be understood by the server due to malformed syntax.'
      code: 400
    }, {
      name: 'ConflictError',
      message: 'This document is already registered.',
      code: 409
    }
  ],

   // Application custom error handlers
  handlers: {
    // Handle validations errors with BadRequestError
    'ValidationError': 'BadRequestError',

    // Handle errors with code 11000 with MongoDuplicatedError
    '11000': 'DuplicatedEntityError'
  },

  // Every failed HTTP request to these urls will be terminated
  exclude: /^\/(assets|api)\//i,

  // Redirection urls
  redirect: {
    error: '/error?err=',
    lost: '/lost?url='
  },

  // Function to use for debugging
  debug: err => {
    console.log('START ERROR LOG:', new Date());
    console.log(err);
    console.log('END ERROR LOG:', new Date());
  },

  // Condition to debug an error
  shouldDebug: err => err.code > 399

};
```
### Usage

To use the package you must configure it and then bind it to the express application.

#### Binding the component
```javascript
const errors = require('tl-errors');
const express = require('express');
const app = express();

// Configure the module
errors.config(config);

// Register other middlewares
// app.use(...);

// Optionally, use the tl-errors not found (404) middleware
app.use(errors.notFoundMiddleware);

// Lastly, bind the tl-errors handler
app.use(errors.handler);
```

#### Using the component
```javascript

const errors = require('tl-errors');

const { BadRequestError } = errors;

module.exports = (router, db) => {

const User = db.model('user');

/**
 * Creates a user.
 */
router.post('/', async (req, res, next) => {

  try {
    const user = await User.create(req.body);

    if (!user) {
      throw new BadRequestError('The user could not be created');
    }

    res.status(HTTP_CODE_CREATED).json(user._id);
  } catch (err) {
    // Any ValidationError caught here will be handled with BadRequestError.
    // Any error with code 11000 caught here will be handled with
    // DuplicatedEntityError.
    next(err);
  }
});
```

Every error triggered in a middleware will be caught inside the component.

### Documentation
Read the [library docs](docs.md) for the methods specification.
