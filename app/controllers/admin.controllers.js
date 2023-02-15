const Status = require('http-status');

const adminService = require('../services/admin.services');
const validateAdminSchema = require('./schemas/admin.schema');

const createAdmin = async (req, res) => {
  try {
    //  validate req
    const admin = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      mobile: req.body.mobile.trim().split('-').join(''),
      instaUsername: req.body.instaUsername.trim(),
      email: req.body.email.trim(),
      designation: req.body.designation.trim(),
      aadhaarCardNumber: req.body.aadhaarCard.trim(),
    };
    const flag = validateAdminSchema(admin);
    if (flag.code) {
      const output = await adminService.addNewAdmin(admin);
      res.status(Status.CREATED).send(output);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findAdmin = async (req, res) => {
  try {
    //  validate req
    const flag = validateAdminSchema({ id: req.id.trim() });
    if (flag.code) {
      const output = await adminService.findAdmin(req.id.trim());
      res.status(Status.OK).send({ output });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const data = await adminService.findAllAdmins();
    res.status(Status.OK).send({ data });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    //  validate req
    const adminId = req.id.trim();
    const admin = {};
    if (req.body.firstName) admin.firstName = req.body.firstName.trim();
    if (req.body.lastName) admin.lastName = req.body.lastName.trim();
    if (req.body.mobile) admin.mobile = req.body.mobile.trim().split('-').join('');
    if (req.body.email) admin.email = req.body.email.trim();
    if (req.body.instaUsername) admin.instaUsername = req.body.instaUsername.trim();
    if (req.body.designation) admin.designation = req.body.designation.trim();
    if (req.body.adhaarcard) admin.aadhaarCardNumber = req.body.aadhaarCard.trim();
    const data = admin;
    data.id = adminId;
    const flag = validateAdminSchema(data);
    if (flag.code) {
      const details = await adminService.updateAdminDetails(adminId, admin);
      res.status(Status.OK).send(details);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeAdmin = async (req, res) => {
  try {
    //  validate req
    const flag = validateAdminSchema({ id: req.id.trim() });
    if (flag.code) {
      const data = await adminService.deleteAdmin(req.id.trim());
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const flag = validateAdminSchema({ instaUsername: username, password });
    if (flag.code) {
      const token = await adminService.varifyAdmin({ username, password });
      res.status(Status.OK).send(token);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const adminId = req.id;
    const { oldPassword, newPassword } = req.body;
    const flag = validateAdminSchema({ oldPassword, newPassword });
    if (flag.code) {
      const data = await adminService.resetPassword({ adminId, oldPassword, newPassword });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const flag = validateAdminSchema({ email });
    if (flag.code) {
      const data = await adminService.forgotPassword({ email });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  createAdmin,
  findAdmin,
  findAllAdmins,
  updateAdmin,
  removeAdmin,
  adminLogin,
  adminResetPassword,
  adminForgotPassword,
};
