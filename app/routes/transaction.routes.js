module.exports = (app) => {
  const router = require('express').Router();
  const transactionServices = require('../controllers/transaction.controller');
  const varification = require('../utils/verificationFunctions');

  router.post('/', varification.verifyCustomerToken, varification.checkStatus, transactionServices.newTransaction);

  router.get('/', varification.verifyAdminToken, varification.checkStatus, transactionServices.findTransactionByFilter);

  router.get('/:id', transactionServices.findTransactionByid);

  router.patch('/:id', varification.verifyAdminToken, varification.checkStatus, transactionServices.updateTransaction);

  //  can be deleted by super admin
  router.delete('/:id', varification.verifyDefaultAdmin, transactionServices.removeTransaction);

  app.use('/api/transaction', router);
};
