const Status = require('http-status');

const fs = require('fs');

const technitionServices = require('../services/technician.services');
const validateTechnicianSchema = require('./schemas/technician.schema');

const addNewTechnician = async (req, res) => {
  try {
    if (!req.files.aadhaarcardproof || !req.files.avatar || !req.files.pancard) {
      if (req.files.aadhaarcardproof) fs.unlinkSync(req.files.aadhaarcardproof[0].path);
      if (req.files.avatar) fs.unlinkSync(req.files.avatar[0].path);
      if (req.files.pancard) fs.unlinkSync(req.files.pancard[0].path);
      throw new Error('Please Upload all documents Aadhaar Card Proof, Profile Picture and PAN Card');
    }
    //  validate req
    const technician = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      mobile: req.body.mobile.trim().split('-').join(''),
      email: req.body.email.trim(),
      instaUsername: req.body.instaUsername.trim(),
      aadhaarCardNumber: req.body.aadhaarCardNumber.trim(),
    };
    const flag = validateTechnicianSchema(technician);
    if (flag.code) {
      technician.aadhaarcardproof = req.files.aadhaarcardproof[0].path;
      technician.avatar = req.files.avatar[0].path;
      technician.pancard = req.files.pancard[0].path;
      const data = await technitionServices.addTechnician(technician);
      res.status(Status.CREATED).send(data);
    } else {
      fs.unlinkSync(req.files.aadhaarcardproof[0].path);
      fs.unlinkSync(req.files.avatar[0].path);
      fs.unlinkSync(req.files.pancard[0].path);
      res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    }
  } catch (err) {
    fs.unlinkSync(req.files.aadhaarcardproof[0].path);
    fs.unlinkSync(req.files.avatar[0].path);
    fs.unlinkSync(req.files.pancard[0].path);
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getTechnicians = async (req, res) => {
  try {
    let output;
    if (req.query.status) {
      if (parseInt(req.query.status, 10) === 0) {
        output = await technitionServices.findAllFreeTechnicians();
      }
      output = await technitionServices.findAllWorkingTechnicians();
    } else output = await technitionServices.findAllTechnicians();
    res.status(Status.OK).send({ output });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getTechnicianById = async (req, res) => {
  try {
    //  validate req
    const techId = req.id.trim();
    const flag = validateTechnicianSchema({ id: techId });
    if (flag.code) {
      const data = await technitionServices.getTechnician(techId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateTechnician = async (req, res) => {
  try {
    //  validate req
    const techId = req.id.trim();
    const technician = {};
    if (req.body.firstName) technician.firstName = req.body.firstName.trim();
    if (req.body.lastName) technician.lastName = req.body.lastName.trim();
    if (req.body.mobile) technician.mobile = req.body.mobile.trim().split('-').join('');
    if (req.body.email) technician.email = req.body.email.trim();
    if (req.body.instaUsername) technician.instaUsername = req.body.instaUsername.trim();
    if (req.body.aadhaarCardNumber) {
      technician.aadhaarCardNumber = req.body.aadhaarCardNumber.trim();
    }
    const techData = technician;
    techData.id = techId;
    const flag = validateTechnicianSchema(techData);
    if (flag.code) {
      const data = await technitionServices.updateTechnicianData(techId, technician);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const deleteTechnician = async (req, res) => {
  try {
    //  validate req
    const techId = req.id.trim();
    const flag = validateTechnicianSchema({ id: techId });
    if (flag.code) {
      const data = await technitionServices.removeTechnician(techId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const technicianLogin = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const flag = validateTechnicianSchema({ instaUsername: username, password });
    if (flag.code) {
      const token = await technitionServices.varifyTechnician({ username, password });
      res.status(Status.OK).send(token);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const technicianResetPassword = async (req, res) => {
  try {
    const technicianId = req.id;
    const { oldPassword, newPassword } = req.body;
    const flag = validateTechnicianSchema({ oldPassword, newPassword });
    if (flag.code) {
      const data = await technitionServices.resetPassword({
        technicianId, oldPassword, newPassword,
      });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const technicianForgotPassword = async (req, res) => {
  try {
    const Email = req.body.email;
    const flag = validateTechnicianSchema({ email: Email });
    if (flag.code) {
      const data = await technitionServices.forgotPassword({ email: Email });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const changeAvatar = async (req, res) => {
  try {
    const techId = req.id;
    const avatarRef = req.file.path;
    const data = await technitionServices.updateAvatar(techId, avatarRef);
    fs.unlinkSync(data.previousAvatar);
    res.status(Status.OK).send({ message: 'Updated Profile Picture Successfully' });
  } catch (err) {
    fs.unlinkSync(req.file.path);
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addNewTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  technicianLogin,
  technicianResetPassword,
  technicianForgotPassword,
  changeAvatar,
};
