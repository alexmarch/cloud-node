const http = require('http');
const express = require('express');
const path = require('path');
const logger = require('debug')('cloud-server');

const app = express();
const server = http.createServer(app);

const errorHandler = require('./errorHandler');
const listenServer = require('./listenServer');
const bindMiddlewares = require('./bindMiddlewares');
const routerHandler = require('./routerHandler');
const pm2Runner = require('./pm2Runner');
const sequelizeHandler = require('./sequelizeHandler');

const startServer = (config) => {
  const { filename } = require.main;
  return Promise.all([
    errorHandler(server),
    bindMiddlewares(app),
    sequelizeHandler(app, config).then(app => {
      return  routerHandler(app, config.appPath ? config.appPath : path.dirname(filename), config);
    })
  ]).then(() => {
    listenServer(server)
      .then(() => {
        return Promise.resolve(server.address());
      });
  }).catch(err => { return console.log(err.message) });
};

const serverApp = {
  start: (config = { development: true, pm2: false }) => {
    const { pm2, development } = config;
    if (pm2) {
      const { filename } = require.main;
      pm2Runner({ args: [ path.dirname(filename) ] }).then(() => {
        console.log('Cloud-server starting...');
      });
    } else {
      startServer(config);
    }
  }
};

if (require.main === module) {
 const [script, processScript, appPath] = process.argv;
 startServer({ appPath }).then(address => {
    console.log('Cloud-server started.');
 });
}

module.exports = { server: serverApp };
