module.exports = (app) => {
  const router = require('express').Router();
  const custServices = require('../controllers/customer.controllers');
  const verification = require('../utils/verificationFunctions');
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const Path = 'app/uploadedFiles/customer/';
      fs.mkdirSync(Path, { recursive: true });
      return cb(null, Path);
    },
    filename: (req, file, cb) => cb(null, Date.now()
      + path.extname(file.originalname)), // Appending extension
  });
  const upload = multer({
    storage,
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
        return cb(new Error('Please Upload an Image'));
      }
      return cb(undefined, true);
    },
  });

  const handleError = (error, req, res) => {
    res.status(400).send({ error: error.message });
  };

  //  adding new customer
  router.post('/', custServices.newCustomer);
  router.post('/me', verification.verifyCustomerToken, verification.checkStatus, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'addressProof', maxCount: 1 }]), custServices.uploaadFiles, handleError);

  //  reading customers
  router.get('/', verification.verifyAdminToken, verification.checkStatus, custServices.getAllCustomers);
  router.get('/me', verification.verifyCustomerToken, verification.checkStatus, custServices.getCustomerById);
  router.get('/address_proof_types', custServices.getAddressProofTypes);

  //  update customer details
  router.patch('/', verification.verifyCustomerToken, verification.checkStatus, custServices.updateCustomer);

  //  delete customer details
  router.delete('/', verification.verifyCustomerToken, verification.checkStatus, custServices.removeCustomer);
  router.delete('/me/avatar', verification.verifyCustomerToken, verification.checkStatus, custServices.removeAvatar);

  //  login customer
  router.post('/login/', custServices.customerLogin);

  //  reset password
  router.post('/reset-password/', verification.verifyCustomerToken, custServices.customerResetPassword);

  //  forgot password
  router.post('/forgot-password/', custServices.customerForgotPassword);

  app.use('/api/customer', router);
};
