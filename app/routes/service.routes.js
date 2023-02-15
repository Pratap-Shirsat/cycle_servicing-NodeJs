module.exports = (app) => {
  const router = require('express').Router();
  const service = require('../controllers/service.controller');

  //  add new service
  router.post('/', service.addService);

  //  get service information
  router.get('/', service.findServices);
  router.get('/:id', service.getService);

  //  update service details
  router.patch('/:id', service.updateService);

  //  delete a service data
  router.delete('/:id', service.deleteService);

  app.use('/api/service', router);
};
