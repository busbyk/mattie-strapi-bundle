'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/config',
    handler: 'config.get',
  },
  {
    method: 'GET',
    path: '/index/:contentType',
    handler: 'search.indexContentType',
  },
];
