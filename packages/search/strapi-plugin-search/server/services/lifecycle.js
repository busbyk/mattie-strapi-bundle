'use strict';

const { omit, pick } = require('lodash/fp');
const { filter } = require('../utils/filters');

/**
 * Gets lifecycle service
 *
 * @returns {object} Lifecycle service
 */
module.exports = () => ({
  /**
   * Load provider methods into lifecycles
   */
  async loadLifecycleMethods() {
    const provider = strapi.plugin('search').provider;
    const { excludedFields = [], prefix: indexPrefix = '', contentTypes } = strapi.config.get('plugin.search');

    // Loop over configured contentTypes in ./config/plugins.js
    contentTypes &&
      contentTypes.forEach((contentType) => {
        const { name, index, prefix: idPrefix = '', fields = [], filters } = contentType;

        if (strapi.contentTypes[name]) {
          const indexName = indexPrefix + (index ? index : name);

          const sanitize = (result) => {
            if (fields.length > 0) {
              return pick(fields, result);
            }

            return omit(excludedFields, result);
          };

          strapi.db.lifecycles.subscribe({
            models: [name],
            async afterCreate(event) {
              if (filters && filter(event.result, filters)) {
                provider.create({
                  indexName,
                  data: sanitize(event.result),
                  id: idPrefix + event.result.id,
                });
              } else {
                strapi.log.info(`Skipping index creation for content type: ${name} (filter returned false)`);
              }
            },

            // Todo: Fix `afterCreateMany` event result only has an count, it doesn't provide an array of result objects.
            // async afterCreateMany(event) {
            //   const { result } = event;
            //   await provider.createMany({
            //     indexName,
            //     data: result.map((entity) => ({ ...sanitize(entity), id: idPrefix + entity.id })),
            //   });
            // },

            async afterUpdate(event) {
              if (filters && filter(event.result, filters)) {
                provider.update({
                  indexName,
                  data: sanitize(event.result),
                  id: idPrefix + event.result.id,
                });
              } else {
                strapi.log.info(`Skipping index creation for content type: ${name} (filter returned false)`);
              }
            },

            // Todo: Fix `afterUpdateMany` event result only has an count, it doesn't provide an array of result objects.
            // async afterUpdateMany(event) {
            //   const { result } = event;
            //   await provider.updateMany({
            //     indexName,
            //     data: result.map((entity) => ({ ...sanitize(entity), id: idPrefix + entity.id })),
            //   });
            // },

            async afterDelete(event) {
              provider.delete({ indexName, id: idPrefix + event.result.id });
            },

            // Todo: Fix `afterDeleteMany` lifecycle not correctly triggered in `em.deleteMany()`, it also doesn't provide an array of result objects.
            // https://github.com/strapi/strapi/blob/a4c27836b481210d93acf932b7edd2ec1350d070/packages/core/database/lib/entity-manager.js#L325-L340
            // async afterDeleteMany(event) {
            //   const { result } = event;
            //   await provider.deleteMany({
            //     indexName,
            //     ids: result.map((entity) => idPrefix + entity.id),
            //   });
            // },
          });
        } else {
          strapi.log.error(`Search plugin bootstrap failed: Search plugin could not load lifecycles on model '${name}' as it doesn't exist.`);
        }
      });
  },
});
