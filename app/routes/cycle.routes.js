module.exports = (app) => {
  const router = require('express').Router();
  const cycle = require('../controllers/cycle.controllers');
  const verification = require('../utils/verificationFunctions');

  //  add new cycle
  router.post('/', verification.verifyCustomerToken, verification.checkStatus, cycle.addNewCycle);

  //  get all cycles of customerid
  router.get('/me', verification.verifyCustomerToken, verification.checkStatus, cycle.getMyCycles);

  //  get cycle information
  router.get('/:cycleId', cycle.getCycle);
  router.get('/', verification.verifyAdminToken, verification.checkStatus, cycle.findAllCycles);

  //  update cycle details
  router.patch('/:cycleId', verification.verifyCustomerToken, verification.checkStatus, cycle.updateCycle);

  //  delete a cycle data
  router.delete('/:cycleId', verification.verifyCustomerToken, verification.checkStatus, cycle.deleteCycle);

  app.use('/api/cycle', router);
};
