# Fi Errors 

An [ExpressJS](http://expressjs.com) middleware to handle custom errors.

### Requirements:
* NodeJS 6.x.x

### Installation

```sh
npm install --save fi-errors
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
      name: 'myCustomError',
      message: 'My custom error default message'
      code: 418
    },
    
    // This error will overwrite the default BadRequestError
    { 
      name: 'BadRequestError',
      message: 'The request could not be understood by the server due to malformed syntax'
      code: 400
    }
  ],

  // Every failed HTTP request to this urls will be terminated 
  exclude: /^\/(assets|api)\//i,

  // Redirection urls
  redirect: {
    error: '/error?err=',
    lost: '/lost?url='
  }
};
```
### Usage

To use the package you must configure it and then bind it to the express application.

#### Binding the component
```javascript
const errors = require('fi-errors');
const express = require('express');
const app = express();

// First load the component
errors.configure(config)

// Somehow register your middlewares
registerMiddlewares(app);

// Lastly bind the errors component
errors.bind(app);
```

#### Using the component
```javascript

const errors = require('fi-errors');

const { BadRequestError } = errors.list();
  
  module.exports = (router, db) => {

  const User = db.model('user');

  /**
   * Creates a user.
   */
  router.post('/', (req, res, next) => {

    User.create(req.body)

      .then((user) => {
        if (!user) {
          throw new BadRequestError('The user could not be created');
        }

        res.status(HTTP_CODE_CREATED).json(user._id);
      })

      .catch(next);

  });

});
```

Every error triggered in a middleware will be catched inside the component, including not found routes and unknown errors.

### Documentation
Read the [library docs](docs.md) for the methods specification.
