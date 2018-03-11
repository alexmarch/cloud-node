const pm2 = require('pm2');
const path = require('path');
const { spawn , exec, execSync} = require('child_process');

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) {
        console.error(err)
        process.exit(2);
      }
      options = Object.assign({}, {
        script : path.resolve(__dirname, 'index.js'), // Script to be run
        instances : 4,                // Optional: Scales your app by 4
        max_memory_restart : '100M',   // Optional: Restarts your app if it reaches 100Mo
        watch: true,
        args: [],
        ignore_watch: ['node_modules']
      }, options);
      pm2.start(options, (err, apps) => {
        if (err) return reject(err);
        pm2.disconnect(_ => {
          let pm2Monit = execSync(path.resolve(__dirname, '../node_modules/.bin/pm2') + ' monit', { stdio: 'inherit' });
        });
        console.log(path.resolve(__dirname, 'index.js'));
        return resolve({ pm2, apps });
      });
    });
  });
}
