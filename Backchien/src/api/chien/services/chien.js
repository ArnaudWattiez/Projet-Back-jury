'use strict';

/**
 * chien service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chien.chien');
