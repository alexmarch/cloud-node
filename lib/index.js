const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);

const errorHandler = require('./errorHandler');
const listenServer = require('./listenServer');
const bindMiddlewares = require('./bindMiddlewares');
const routerHandler = require('./routerHandler');
const pm2Runner = require('./pm2Runner');

const startServer = (config) => {
  return Promise.all([
    errorHandler(server),
    bindMiddlewares(app),
    routerHandler(app, path.dirname(require.main.filename), config)
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
      pm2Runner().then(() => {
        console.log('Cloud-server starting...');
      });
    } else {
      startServer(config);
    }
  }
};

if (require.main === module) {
 startServer().then(address => {
    console.log('Start from console mode.');
 });
}

module.exports = { server: serverApp };
