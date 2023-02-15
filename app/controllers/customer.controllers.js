const Status = require('http-status');

const custServices = require('../services/customer.services');
const validateCustomerSchema = require('./schemas/customer.schema');

const newCustomer = async (req, res) => {
  try {
    //  validate req
    const customer = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      mobile: req.body.mobile.trim().split('-').join(''),
      instaUsername: req.body.instaUsername.trim(),
      email: req.body.email.trim(),
      address: req.body.address.trim(),
    };
    const flag = validateCustomerSchema(customer);
    if (flag.code) {
      const output = await custServices.addCustomer(customer);
      res.status(Status.CREATED).send(output);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getCustomerById = async (req, res) => {
  //  validate req
  try {
    const custData = {};
    custData.id = req.id.trim();
    const flag = validateCustomerSchema(custData);
    if (flag.code) {
      const output = await custServices.getCustomer(custData.id);
      res.status(Status.OK).send({ output });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const data = await custServices.allCustomers();
    res.status(Status.OK).send({ data });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    //  validate req
    const custId = req.id.trim();
    const customer = {};
    if (req.body.firstName) customer.firstName = req.body.firstName.trim();
    if (req.body.lastName) customer.lastName = req.body.lastName.trim();
    if (req.body.mobile) customer.mobile = req.body.mobile.trim().split('-').join('');
    if (req.body.email) customer.email = req.body.email.trim();
    if (req.body.instaUsername) customer.instaUsername = req.body.instaUsername.trim();
    if (req.body.address) customer.address = req.body.address.trim();
    const custData = customer;
    custData.id = custId;
    const flag = validateCustomerSchema(custData);
    if (flag.code) {
      const data = await custServices.updateCustomerDetails(custId, customer);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeCustomer = async (req, res) => {
  try {
    //  validate req
    const custData = {};
    custData.id = req.id.trim();

    const flag = validateCustomerSchema(custData);
    if (flag.code) {
      const data = await custServices.deleteCustomer(custData.id);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const customerLogin = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const flag = validateCustomerSchema({ instaUsername: username, password });
    if (flag.code) {
      const token = await custServices.varifyCustomer({ username, password });
      res.status(Status.OK).send(token);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const customerResetPassword = async (req, res) => {
  try {
    const customerId = req.id;
    const { oldPassword, newPassword } = req.body;
    const flag = validateCustomerSchema({ oldPassword, newPassword });
    if (flag.code) {
      const data = await custServices.resetPassword({ customerId, oldPassword, newPassword });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const customerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body.email;
    const flag = validateCustomerSchema({ email });
    if (flag.code) {
      const data = await custServices.forgotPassword({ email });
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getAddressProofTypes = async (req, res) => {
  try {
    const data = await custServices.getAddressProofCategories();
    res.status(Status.OK).send(data);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const uploaadFiles = async (req, res) => {
  try {
    const customerId = req.id;
    const addressProofPaths = {};
    if (req.files.avatar) addressProofPaths.profilePic = req.files.avatar[0].path;
    if (req.files.addressProof && req.body.addressProofType) {
      addressProofPaths.addressProofCategory = req.body.addressProofType;
      addressProofPaths.addressProof = req.files.addressProof[0].path;
    }
    const data = await custServices.uploadFilesOfCustomer(customerId, addressProofPaths);
    res.status(Status.OK).send(data);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeAvatar = async (req, res) => {
  try {
    const custId = req.id;
    const data = await custServices.removeProfilePicture(custId);
    res.status(Status.OK).send(data);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  newCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  removeCustomer,
  customerLogin,
  customerResetPassword,
  customerForgotPassword,
  getAddressProofTypes,
  uploaadFiles,
  removeAvatar,
};
