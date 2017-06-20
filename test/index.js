'use strict';

const server = require('./server');
const config = require('./config');

const expect = require('chai').expect;
const request = require('request');
const Mocha = require('mocha');

const mocha = new Mocha(config.mocha);

var req;

server.start(() => {

  /* Set request defaults */
  req = request.defaults({
    baseUrl: `${ config.server.url }:${ config.server.port }/api`, // Following queries will start with...
    strictSSL: false, // Don't panic with insecure app
    jar: true // Store app cookies in a jar
  });

  global.expect = expect;
  global.req = req;

  mocha.addFile(config.tests);

  mocha.run(failures => {
    process.exit(failures);
  });
});
