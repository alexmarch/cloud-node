const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

module.exports = app => {
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(compression());
    app.use((req, res, next) => {
      res.ok = msg => res.status(200).send(msg);
      re.badRequest = payload => res.status(400).json(payload);
      res.notFound = payload => res.status(404).json(payload);
      res.unauthorized = payload => res.status(404).json(payload);
      next();
    });
    app.use((err, req, res, next) => {
      next();
    });
    return Promise.resolve(app)
};
