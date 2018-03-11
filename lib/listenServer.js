const { NODE_ENV, SERVER_HOST, SERVER_PORT } = process.env;
const config = {
  host: !NODE_ENV || NODE_ENV == 'development' ? 'localhost' : SERVER_HOST,
  port: !NODE_ENV || NODE_ENV == 'development' ? 3000 : SERVER_PORT,
};

const defaultFn = (server, resolve) => {
  const address = server.address();
  console.log(`Cloud-node server start at: http://${address.address}:${address.port}`);
  resolve(address);
};
/**
 * Listen handler for http server
 * @param {Object} server
 * @param {Function} cb
 */
module.exports = ( server, cb = defaultFn ) => {
  return new Promise(resolve => {
    server.listen({
      ...config
    }, cb.bind(this, server, resolve));
  });
}

