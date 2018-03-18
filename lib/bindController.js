const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const { CLOUD_NODE_SERVER_CTRL_PATH } = process.env;
const logger = require('debug')('controller');
const chalk = require('chalk');
const sequelize = require('sequelize');

const methods = ['get', 'post', 'delete', 'option', 'patch', 'put', 'all'];

// FIXME: - Move function bindModel to utils module
const bindModel = (model, ctrl, path, app) => {
  if (model && !ctrl.models[model]) { // Import models
    const modelPath = `${app.appBaseDir}${path}${model}.js`;
    if (fs.existsSync(modelPath)) {
      ctrl.models[model] = app.sequelize.import(modelPath);
      console.log(chalk.bgBlueBright.white('BIND MODEL:'), model);
    }
  }
  return ctrl;
}
/**
 * Bind controller actions
 * @param {String} name
 * @param {Array} props - Controller properties
 */
module.exports = (name, props, namespace, app, resourceModel) => {
  const router = Router();
  // FIXME: - Move function emptyAction to utils module
  let emptyAction = (req, res, next) => { res.ok(`You don\'t implements this API. You can create the action in controller (${name})`); };
  let actionFn =emptyAction;
  let policesActions;
  const policesPath = `${app.appBaseDir}/config/polices.js`; //@TODO: - Polices improve load config

  if (fs.existsSync(policesPath)) policesActions = require(policesPath);

  props.forEach(prop => {
    const verb = Object.keys(prop)[0].toLowerCase();
    let ctrl = {};

    if (methods.indexOf(verb) >= 0) {
      let { as, controller, action, polices, model } = prop[verb];

      const path = `/${name}${as ? '/' + as : ''}${action && as === undefined ? '/' + action.toLowerCase() : ''}`;
      const ctrlDir =  CLOUD_NODE_SERVER_CTRL_PATH || '/controllers/';
      const modelPath = CLOUD_NODE_SERVER_CTRL_PATH || '/models/';
      const ctrlPath = `${app.appBaseDir}${ctrlDir}${controller ? controller : name}.js`;

      // Check if controller file exist
      if (fs.existsSync(ctrlPath)) {

        if ( app.controllers[name] ) {
          ctrl = app.controllers[name];
        } else {
          ctrl = require(ctrlPath); // Include controller object
          ctrl.models = {};
        }

        const models = resourceModel || model;

        if (Array.isArray(models)) {
          models.forEach(model => {
            bindModel(model, ctrl, modelPath, app);
          });
        } else if(models) {
          bindModel(models, ctrl, modelPath, app);
        }

        app.controllers[name] = ctrl;

        if (typeof ctrl[action] === 'function') {
          actionFn = ctrl[action].bind(ctrl);
        } else {
          actionFn = emptyAction;
        }
      } else {
        ctrl = {};
      }

      if (Array.isArray(polices) && polices.length > 0) {
        if (policesActions) {
          const actions = [];
          for (let policeAction of polices){
            if (policesActions[policeAction]) {
              actions.push(policesActions[policeAction].bind(ctrl));
            } else if(policesActions[policeAction.toLowerCase()]) {
              actions.push(policesActions[policeAction.toLowerCase()].bind(ctrl));
            }
          };
          // @FIXME: - need remove this log or improve it ove debug module
          console.log(chalk.bgGreen.yellow('BIND POLICES:'), polices);
          router[verb.toLowerCase()](path, actions, actionFn);
        }
      } else {
        router[verb.toLowerCase()](path, actionFn);
      }
      // FIXME: - need improve logger for API
      console.log(chalk.green(`BIND (${verb.toUpperCase()}):`),
        chalk.white(`/${namespace}/${name}${as ? '/' + as : ''}${action && as === undefined ? '/' + action.toLowerCase() : ''}`),
        chalk.blue('action:'),`(${action})`);
    }
  });
  return router;
};
