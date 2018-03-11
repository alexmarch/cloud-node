const { server, mockServer } = require('./lib');

module.exports = {
    server,
    mockServer /* We using mock server for NODE_ENV=test environment */
};