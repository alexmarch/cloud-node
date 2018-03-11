const pm2 = require('pm2');
const path = require('path');
const { spawn } = require('child_process');

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
        ignore_watch: ['node_modules']
      }, options);
      pm2.start(options, (err, apps) => {
        if (err) return reject(err);
        pm2.disconnect(err => {
          let spawnPm2 = spawn(path.resolve(__dirname, '../node_modules/.bin/pm2'), ['monit']);
          spawnPm2.stderr.on('data', data => {
            console.error(data.toString());
          });
          spawnPm2.stdout.on('data', data => {
            console.log(data.toString());
          });
          process.exit(2);
        });
        // pm2.list((err, proc_list) => {
        //   console.log(proc_list);
        // });
        return resolve({ pm2, apps });
      });
    });
  });
}
