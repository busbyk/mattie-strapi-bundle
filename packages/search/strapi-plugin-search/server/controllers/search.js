'use strict';

/**
 * @param {{ strapi: Strapi }} strapi
 * @returns {Object}
 */
function createSearchController({ strapi }) {
  return {
    async indexContentType(ctx) {
      // validate that there is a param of contentType
      if (!ctx.params.contentType) {
        ctx.badRequest('contentType is required');
      }

      // validate that the contentType is a valid content type
      const contentType = strapi.contentTypes[ctx.params.contentType];
      if (!contentType) {
        ctx.badRequest('contentType is not a valid content type');
      }

      // send to search service
      const { successCount, totalCount } = await strapi.plugin('search').service('search').indexContentType({ contentType: ctx.params.contentType });

      // send success response
      ctx.send({ ok: true, successCount, totalCount });
    },
  };
}

module.exports = {
  createSearchController,
};
