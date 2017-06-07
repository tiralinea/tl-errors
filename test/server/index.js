'use strict';

const express = require('express');
const path = require('path');
const http = require('http');

const router = express.Router();

const defaults = require(path.join('..', '..', 'lib', 'defaults'));
const errors = require(path.join('..', '..', 'lib', 'index'));
const config = require(path.join('..', 'config'));

const ERR_EACCES = '\n  Bind [%s:%s] requires elevated privileges!\n';
const ERR_EADDRINUSE = '\n  Bind [%s:%s] is already in use!\n';

const EADDRINUSE = 'EADDRINUSE';
const EACCES = 'EACCES';

const LISTEN = 'listen';
const API = '/api';

errors.configure(defaults);

module.exports = {

  start: function start(next) {

    const app = express();

    /* Register the server routes */
    require('./routes')(router);

    app.use(API, router);

    /* Register route error handlers */
    errors.bind(app);

    /* Initalize server */
    var server;

    server = http.createServer(app);

    server.listen(config.server.port);

    server.once('listening', () => {
      console.log('\n Test server is listening on port %s\n', config.server.port);
      next();
    });

    server.on('error', function onServerError(error) {
      if (error.syscall !== LISTEN) {
        throw error;
      }

      switch (error.code) {
      case EACCES:
        console.error(ERR_EACCES, error.address, error.port);
        process.exit(1);
        break;

      case EADDRINUSE:
        console.error(ERR_EADDRINUSE, error.address, error.port);
        process.exit(1);
        break;

      default:
        throw error;
      }
    });

    process.once('SIGINT', () => {
      console.log('\n\n  Shutting test server down...\n');

      process.exit();
    });

  }
};