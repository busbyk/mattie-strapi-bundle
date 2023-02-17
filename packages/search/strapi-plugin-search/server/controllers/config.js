'use strict';

/**
 * @param {{ strapi: Strapi }} strapi
 * @returns {Object}
 */
function createConfigController({ strapi }) {
  return {
    async get(ctx) {
      const { excludedFields = [], prefix: indexPrefix = '', contentTypes } = strapi.config.get('plugin.search');

      ctx.send({
        excludedFields,
        indexPrefix,
        contentTypes,
      });
    },
  };
}

module.exports = {
  createConfigController,
};
