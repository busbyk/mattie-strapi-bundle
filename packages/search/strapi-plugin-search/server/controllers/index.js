'use strict';

const { createConfigController: config } = require('./config');
const { createSearchController: search } = require('./search');

module.exports = {
  config,
  search,
};
