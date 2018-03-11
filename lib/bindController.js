const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const { CLOUD_NODE_SERVER_CTRL_PATH } = process.env;
const logger = require('debug')('controller');
const chalk = require('chalk');

/**
 * Bind controller actions
 * @param {String} name
 * @param {Array} props
 */
module.exports = (name, props, namespace, app) => {
  const router = Router();
  let emptyAction = (req, res, next) => { res.ok(`You don\'t implements this API. You can create the action in controller (${name})`); };
  let actionFn =emptyAction;

  props.forEach(prop => {
    var verb = Object.keys(prop)[0];
    let { as, controller, action, polices } = prop[verb];
    const path = `/${name}${as ? '/' + as : ''}${action && !as ? '/' + action : ''}`;
    const dir =  CLOUD_NODE_SERVER_CTRL_PATH || '/controllers/';
    const fullPath = `${app.appBaseDir}${dir}${controller ? controller : name}.js`;
    if (fs.existsSync(fullPath)) {
      const ctrl = require(fullPath);
      app.controllers[name] = ctrl;
      if (typeof ctrl[action] === 'function') {
        actionFn = ctrl[action];
      } else {
        actionFn = emptyAction;
      }
    }
    if (Array.isArray(polices) && polices.length > 0) {
      if (fs.existsSync(`${app.appBaseDir}/config/polices.js`)) {
        const policesActions = require(`${app.appBaseDir}/config/polices.js`);
        const actions = [];
        for ( let policeAction of polices){
          if (policesActions[policeAction]) {
            actions.push(policesActions[policeAction]);
          } else if(policesActions[policeAction.toLowerCase()]) {
            actions.push(policesActions[policeAction.toLowerCase()]);
          }
        };
        // @FIXME: - need remove this log or improve it ove debug module
        console.log(chalk.blue('SET POLICES:'), polices);
        router[verb.toLowerCase()](path, actions, actionFn);
      }
    } else {
      router[verb.toLowerCase()](path, actionFn);
    }
    console.log(chalk.green(`BIND (${verb.toUpperCase()}):`), chalk.white(`/${namespace}/${name}${as ? '/' + as : ''}${action && !as ? '/' + action : ''}`));
  });
  return router;
};
