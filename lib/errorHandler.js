module.exports = server => {
  return Promise.resolve(() => {
      server.on('error', err => {
        switch(err.code) {
          case 'EADDRINUSE':
            console.log('Address in use, auto update address...');
            // @TODO: - Restart new server with next port number
            break;
        }
      });
      server.on('connection', c => {
        // @TODO: - Connection event for server
      });
  });
}
