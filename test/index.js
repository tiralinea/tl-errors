'use strict';

const request = require('request');
const Mocha = require('mocha');

const server = require('./server');
const config = require('./config');
const req = require('./req');

const mocha = new Mocha(config.mocha);

server.start(() => {
  /* Set request defaults */
  req.set(
    request.defaults({
      baseUrl: `${config.server.url}:${config.server.port}/api`, // Following queries will start with...
      strictSSL: false, // Don't panic with insecure app
      jar: true // Store app cookies in a jar
    })
  );

  mocha.addFile(config.tests);

  mocha.run(failures => {
    process.exit(failures);
  });
});
