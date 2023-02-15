module.exports = (app) => {
  const router = require('express').Router();
  const techService = require('../controllers/technician.controllers');
  const verification = require('../utils/verificationFunctions');
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const Path = 'app/uploadedFiles/technician/';
      fs.mkdirSync(Path, { recursive: true });
      cb(null, Path);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));// Appending extension
    },
  });

  const upload = multer({
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
        return cb(new Error('Please Upload an Image'));
      }
      return cb(undefined, true);
    },
    storage,
  });

  const handleError = (error, req, res) => {
    res.status(400).send({ error: error.message });
  };

  //  add a new technition
  router.post('/', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'aadhaarcardproof', maxCount: 1 }, { name: 'pancard', maxCount: 1 }]), techService.addNewTechnician, handleError);
  router.post('/me/update_avatar', verification.verifyTechnicianToken, verification.checkStatus, upload.single('avatar'), techService.changeAvatar, handleError);

  //  get technitions
  router.get('/', verification.verifyAdminToken, verification.checkStatus, techService.getTechnicians);
  router.get('/me', verification.verifyTechnicianToken, verification.checkStatus, techService.getTechnicianById);

  //  update techition details
  router.patch('/', verification.verifyTechnicianToken, verification.checkStatus, techService.updateTechnician);

  //  delete a technition
  router.delete('/', verification.verifyTechnicianToken, verification.checkStatus, techService.deleteTechnician);

  //  login technician
  router.post('/login/', techService.technicianLogin);

  //  reset password
  router.post('/reset-password/', verification.verifyTechnicianToken, techService.technicianResetPassword);

  //  forgot password
  router.post('/forgot-password/', techService.technicianForgotPassword);

  app.use('/api/technition', router);
};
