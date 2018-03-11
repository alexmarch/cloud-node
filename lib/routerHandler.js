const yaml = require('node-yaml');
const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const bindController = require('./bindController');
const resourceActions = require('./resourceActions');
const { CLOUD_NODE_SERVER_CONFIG_PATH } = process.env;


/*
routes:
  - namespace:
      name: 'apis'
      resources:
        - home:
      cloud: # - /apis/cloud/index
        - get:
            as: 'index'
            controller: 'cloud'
            action: 'index'
        - get:
            as: 'home'
            controller: 'cloud'
            action: 'home'
        - all:
            controller: 'cloud'
            action: 'all'
*/
const parseRoutesConfig = config => {
  if (!Array.isArray(config.routes)) throw ('Routes block support only list of namespace.');
  const routes = config.routes;
  routes.forEach(({ namespace }) => {
    let { name, resources, ...controllers } = namespace;
    let baseRoute = Router();
    if (resources) {
      resources.forEach(resource => {
        // @TODO: - Need parse resourse from routes
        let props = resourceActions(name);
        let ctrlName = Object.keys(resource)[0];
        let router = bindController(ctrlName, props, name, this.app);
        this.app.use(name.indexOf('/') !== 0 ? `/${name}` : name, router);
      });
    };
    Object.keys(controllers).forEach(ctrlName => {
      let props = controllers[ctrlName];
      let router = bindController(ctrlName, props, name, this.app);
      this.app.use(name.indexOf('/') !== 0 ? `/${name}` : name, router);
    });

  });
};

/**
 * Parse routes YAML config and bind with api controller function
 * @param {Object} app
 * @param {String} baseDir
 */
module.exports = (app, baseDir = '../') => {
  this.app = app;
  this.app.controllers = {};
  this.app.models = {};
  this.app.appBaseDir = baseDir;
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(baseDir, `${CLOUD_NODE_SERVER_CONFIG_PATH || 'config'}/routes.yml`);
    if (!fs.existsSync(fullPath)) return reject(new Error(`${fullPath} not exist.`));
    yaml.read(fullPath, (err, config) => {
      if (err) return reject(err);
      if (!config.routes) return reject(new Error('Wrong routes syntax, should contain routes root.'))
      parseRoutesConfig.bind(this)(config);
      resolve(config);
    });
  });
}
