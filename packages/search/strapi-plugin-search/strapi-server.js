'use strict';

const bootstrap = require('./server/bootstrap');
const config = require('./server/config');
const services = require('./server/services');
const controllers = require('./server/controllers');
const routes = require('./server/routes');

/**
 * @returns {object} Plugin server object
 */
module.exports = () => ({
  bootstrap,
  config,
  services,
  controllers,
  routes,
});
