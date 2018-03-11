# cloud-node-server
### Cloud-node - web framework build on top of ExpressJS
![Logo](https://rawgit.com/alexmarch/cloud-node/master/assets/logo-v0.1.svg)

![npm](https://img.shields.io/npm/l/express.svg)
![npm](https://img.shields.io/npm/v/npm.svg)

Very powerful framework, that allow you very quick, and simple start develop any API, with just config, without any programming. 

## Versions
Node v8.9.4 (npm v5.7.1)

## Install
```bash
  npm install @cloud-node/server@0.0.5-alpha
```
## How to use
```javascript
  const { server } = require('@cloud-node/server');
  server.start({
    pm2: process.env.NODE_ENV === 'development' ? true : false
  });
```
If option **pm2** is enabled in console you will see pm2 monitor
![image](https://i.imgur.com/vXp5hI7.png|100)
## Setup
### Routes
Create configuration file for routes **config/routes.yml** with next structure
```yml
routes:
  - namespace:
      name: 'apis'
      resources: # - Resource will provice all RESTful API methods for controller home
        - home:
      cloud: # - Endpoint will look like: (GET) /apis/cloud/index
        - get:
            action: 'index'
        - get:
            as: 'home' # - Endpoint will look like: (GET) /apis/cloud/home
            controller: 'cloud'
            action: 'home'
        - all: # - Endpoint will allow all request methods
            controller: 'cloud'
            action: 'all'
```
### Polices
Protect you route with polices, create file **config/polices.js**
```javascript
  module.exports = {
    isAuth: (req, res, next) => ( req.user.isAuth ? next() : next('User not authorized.') )// Checking if user authorized
  }
```
```yaml
  - get:
      action: 'index'
      polices:
          - 'isAuth'
          # ...
```
### Controllers
Create controller file in the application root folder **controllers/cloud.js**
```javascript
  module.exports = {
    index: (req, res) => res.ok('Hi, cloud-node.')
  }
```
routes configuration
```yaml
  - get: # - Endpoint will look like: (GET) /apis/cloud/index/:id
      as: 'index/:id'
      controller: 'cloud'
      action: 'index'
```
### Models
@TODO: - In progress

### Plugins
@TODO  - In progress
