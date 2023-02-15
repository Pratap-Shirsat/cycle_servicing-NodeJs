const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const generator = require('generate-password');

const fs = require('fs');

const db = require('../models');

const Customer = db.customer;

const addCustomer = async (data) => {
  //  add new customer to database
  const newPassword = await generator.generate({
    length: 10,
    numbers: true,
  });
  const salt = await bcrypt.genSalt(10);
  const Data = data;
  Data.password = await bcrypt.hash(newPassword, salt);
  const customer = await Customer.create(Data);
  require('../utils/emailSender').sendWelcomeMail(customer, newPassword);

  return {
    customerId: customer.customerId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    mobile: customer.mobile,
    instaUsername: customer.instaUsername,
    email: customer.email,
    address: customer.address,
  };
};

const allCustomers = () => Customer.findAll({ attributes: { exclude: ['password', 'role', 'isSystemGenerated', 'addressProofCategory', 'addressProof', 'profilePic'] } });

const getCustomer = (id) => Customer.findByPk(id, { attributes: { exclude: ['password', 'role', 'isSystemGenerated', 'addressProofCategory', 'addressProof', 'profilePic'] } });

const updateCustomerDetails = async (id, details) => {
  //  update details in database
  await Customer.update(details, {
    where: {
      customerId: id,
    },
  });
  return { message: 'Updated Customer Successfully' };
};

const deleteCustomer = async (custId) => {
  //  delete customer from database
  const d = await Customer.destroy({
    where: {
      customerId: custId,
    },
  });
  if (d > 0) return { message: 'Deleted Customer Successfully' };
  throw new Error(`User with id ${custId} Not Found`);
};

const varifyCustomer = async (data) => {
  const customer = await Customer.findAll({
    where: {
      instaUsername: data.username,
    },
  });
  if (customer.length === 0) throw new Error(`The Customer with Username ${data.username} does Not Exists.`);
  const isMatch = await bcrypt.compare(data.password, customer[0].dataValues.password);
  if (!isMatch) throw new Error('Incorrect Password !');
  const payload = {
    role: 'CUSTOMER',
    customerId: customer[0].dataValues.customerId,
    isSystemGenerated: customer[0].dataValues.isSystemGenerated,
  };
  return { token: await jwt.sign(payload, process.env.specialKey, { expiresIn: 36000 }) };
};

const resetPassword = async (data) => {
  const customer = await Customer.findByPk(data.customerId);
  if (customer === null) throw new Error(`Customer with id ${data.customerId} does not exists`);
  const isMatch = await bcrypt.compare(data.oldPassword, customer.dataValues.password);
  if (!isMatch) throw new Error('Entered old  Password is Incorrect!');
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(data.newPassword, salt);
  await Customer.update({ password: newPassword, isSystemGenerated: false }, {
    where: {
      customerId: customer.customerId,
    },
  });
  return { message: 'Updated Password Successfully' };
};

const forgotPassword = async (data) => {
  const customer = await Customer.findAll({
    where: {
      email: data.email,
    },
  });
  if (customer.length > 0) {
    const newPassword = await generator.generate({
      length: 10,
      numbers: true,
    });
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);
    await Customer.update({ password: encryptedPassword, isSystemGenerated: true }, {
      where: {
        customerId: customer[0].dataValues.customerId,
      },
    });
    require('../utils/emailSender').sendUpdatedPasswordEmail(customer[0], newPassword);

    return { message: 'You will shortly receive an Email with your credentials' };
  }
  throw new Error(`Customer with email address ${data.email} Does Not Exists`);
};

const getAddressProofCategories = async () => {
  const proofTypes = await Customer.rawAttributes.addressProofCategory.values;
  return {
    data: proofTypes,
  };
};

const uploadFilesOfCustomer = async (custId, uploadData) => {
  const custData = await Customer.findByPk(custId);
  if (uploadData.profilePic && custData.profilePic !== null) fs.unlinkSync(custData.profilePic);
  if (uploadData.addressProofCategory && custData.addressProofCategory !== null) {
    fs.unlinkSync(custData.addressProofCategory);
  }
  await Customer.update(uploadData, {
    where: {
      customerId: custId,
    },
  });
  return { message: 'Uploaded Files Successfully' };
};

const removeProfilePicture = async (custId) => {
  const customer = await Customer.findByPk(custId);
  await Customer.update({ profilePic: null }, {
    where: {
      customerId: custId,
    },
  });
  if (customer.profilePic !== null) {
    fs.unlinkSync(customer.profilePic);
    return { message: 'Deleted profile Picture Successfully' };
  }
  return { message: 'Profile Picture is Not Set' };
};

module.exports = {
  addCustomer,
  getCustomer,
  allCustomers,
  updateCustomerDetails,
  deleteCustomer,
  varifyCustomer,
  resetPassword,
  forgotPassword,
  getAddressProofCategories,
  uploadFilesOfCustomer,
  removeProfilePicture,
};
