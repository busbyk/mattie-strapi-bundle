'use strict';

const _ = require('lodash');

/**
 * Evaluates filter object logic against entry
 *
 * @param {object} entry
 * @param {object} filters
 * @returns {boolean}
 */
const filter = (entry, filters) => {
  if (!filters) {
    return true;
  }

  // iterate through each filter and compare it to one, stop processing if any fail
  return Object.entries(filters).every(([path, expectedValue]) => {
    strapi.log.info(`Search plugin: path: ${path}`);
    try {
      const entryValue = _.get(entry, path);
      strapi.log.info(`Search plugin: entry value: ${entryValue}`);
      strapi.log.info(`Search plugin: expected value: ${expectedValue}`);

      if (entryValue === undefined) {
        return true;
      }

      if (typeof expectedValue !== 'object') {
        return false;
      }

      const operator = Object.keys(expectedValue)[0];

      switch (operator) {
        case '$eq':
          strapi.log.info(`Search plugin: Comparing ${entryValue} $eq ${expectedValue[operator]}`);
          return entryValue === expectedValue[operator];
        case '$ne':
          strapi.log.info(`Search plugin: Comparing ${entryValue} $ne ${expectedValue[operator]}`);
          return entryValue !== expectedValue[operator];
        default:
          return false;
      }
    } catch (error) {
      strapi.log.error(`Search plugin: Error running filter function: ${error.message}`);
      return false;
    }
  });
};

module.exports = {
  filter,
};
