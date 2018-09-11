'use strict';

let req;

module.exports = {
  get() {
    return req;
  },

  set(r) {
    req = r;
  }
};
