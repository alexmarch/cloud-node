const Sequelize = require('sequelize');

module.exports = (app, options) => {
  return new Promise(resolve => {
    if (options.db) {
      const {database, username, password, ...otherOptions} = { operatorsAliases: false, ...options.db };
      const sequelize = new Sequelize(database, username, password, {
        ...otherOptions
      });
      app.sequelize = sequelize;
    }
    resolve(app);
  });
};
