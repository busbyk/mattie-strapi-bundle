'use strict';

const { omit, pick } = require('lodash/fp');
const { filter } = require('../utils/filters');

function sanitizeEntry({ entry, fields, excludedFields }) {
  if (fields.length > 0) {
    return pick(fields, entry);
  }

  return omit(excludedFields, entry);
}

function getFirstLevelAttributeFromKey(key) {
  return key.split('.')[0];
}

/**
 * Gets search service
 *
 * @returns {object} Search service
 */
module.exports = () => ({
  /**
   * Index all entries for a given content type that aren't already indexed
   */
  async indexContentType({ contentType }) {
    const provider = strapi.plugin('search').provider;
    const { excludedFields = [], prefix: indexPrefix = '', contentTypes } = strapi.config.get('plugin.search');

    const contentTypeConfigs = contentTypes.reduce((acc, contentType) => {
      acc[contentType.name] = contentType;
      return acc;
    }, {});

    // get all entries for the content type
    const entries = await strapi.entityService.findMany(contentType, {
      fields: [
        ...(contentTypeConfigs[contentType].fields || []),
        ...(contentTypeConfigs[contentType].filters ? Object.keys(contentTypeConfigs[contentType].filters).map(getFirstLevelAttributeFromKey) : []),
      ],
    });

    // provider.create each entry
    const results = await Promise.allSettled(
      entries.map(async (entry) => {
        if (contentTypeConfigs[contentType].filters && !filter(entry, contentTypeConfigs[contentType].filters)) {
          throw new Error(`Skipping index creation for content type: ${contentType} (filter returned false)`);
        }

        // get the full entry
        /**
         * TODO: this doesn't populate everything that is populated afterCreate/afterUpdate
         * lifecycle method so we need to figure out how to get the full entry here - check
         * out the afterCreate/afterUpdate lifecycle methods in the core repo
         * */
        const fullEntry = await strapi.entityService.findOne(contentType, entry.id);

        const sanitizedEntry = sanitizeEntry({
          entry: fullEntry,
          fields: contentTypeConfigs[contentType].fields || [],
          excludedFields,
        });

        // get the index name
        const indexName = indexPrefix + (contentTypeConfigs[contentType].index ? contentTypeConfigs[contentType].index : contentType);

        // create the entry
        /**
         * TODO: to effectively return results here we need to convert this to an async
         * function and get the result from algolia
         */
        provider.create({
          indexName,
          data: sanitizedEntry,
          id: contentTypeConfigs[contentType].prefix + entry.id,
        });

        return entry.id;
      }),
    );

    let successCount = 0;

    // log successful indexing
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        strapi.log.info(`Indexed ${contentType} entry ${result.value}`);
        successCount++;
      }
      if (result.status === 'rejected') {
        strapi.log.error(`Failed to index ${contentType} entry ${result.reason}`);
      }
    });

    // return summary
    return {
      successCount,
      totalCount: entries.length,
    };
  },
});
