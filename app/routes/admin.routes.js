module.exports = (app) => {
  const router = require('express').Router();
  const adminControl = require('../controllers/admin.controllers');
  const verification = require('../utils/verificationFunctions');

  router.post('/', verification.verifyDefaultAdmin, adminControl.createAdmin);

  router.get('/', verification.verifyDefaultAdmin, adminControl.findAllAdmins);
  router.get('/me', verification.checkAdminToken, adminControl.findAdmin);

  router.patch('/', verification.checkAdminToken, verification.checkStatus, adminControl.updateAdmin);

  router.delete('/', verification.checkAdminToken, verification.checkStatus, adminControl.removeAdmin);

  router.post('/login/', adminControl.adminLogin);

  //  reset password
  router.post('/reset-password/', verification.checkAdminToken, adminControl.adminResetPassword);

  //  forgot password
  router.post('/forgot-password/', adminControl.adminForgotPassword);

  app.use('/api/admin', router);
};
