const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const generator = require('generate-password');

const db = require('../models');

const Admin = db.admin;

const addNewAdmin = async (data) => {
  const newPassword = await generator.generate({
    length: 10,
    numbers: true,
  });
  const Data = data;
  const salt = await bcrypt.genSalt(10);
  Data.password = await bcrypt.hash(newPassword, salt);
  const admin = await Admin.create(Data);
  require('../utils/emailSender').sendWelcomeMail(admin, newPassword);

  return {
    adminId: admin.adminId,
    firstName: admin.firstName,
    lastName: admin.lastName,
    designation: admin.designation,
    email: admin.email,
    mobile: admin.mobile,
    instaUsername: admin.instaUsername,
    aadhaarCardNumber: admin.aadhaarCardNumber,
    role: admin.role,
  };
};

const findAdmin = (adminId) => Admin.findByPk(adminId, { attributes: { exclude: ['password', 'isSystemGenerated'] } });

const findAllAdmins = () => Admin.findAll({ attributes: { exclude: ['password', 'isSystemGenerated'] } });

const updateAdminDetails = async (adminId, data) => {
  const admin = await Admin.findByPk(adminId);
  if (admin === null) throw new Error(`Admin with id ${adminId} Does not Exists`);
  await Admin.update(data, {
    where: {
      adminId,
    },
  });
  return { message: `Updated admin with id ${adminId} successfully` };
};

const deleteAdmin = async (adminId) => {
  const admin = await Admin.findByPk(adminId);
  if (admin === null) throw new Error(`Admin with id ${adminId} Does not Exists`);

  await Admin.destroy({
    where: {
      adminId,
    },
  });
  return { message: `Deleted admin with id ${adminId} successfully` };
};

const varifyAdmin = async (data) => {
  const admin = await Admin.findAll({
    where: {
      instaUsername: data.username,
    },
  });
  if (admin.length === 0) throw new Error(`The Admin with Username ${data.username} does Not Exists.`);
  const isMatch = await bcrypt.compare(data.password, admin[0].dataValues.password);
  if (!isMatch) throw new Error('Incorrect Password !');
  const payload = {
    role: admin[0].dataValues.role,
    adminId: admin[0].dataValues.adminId,
    isSystemGenerated: admin[0].dataValues.isSystemGenerated,
  };
  const token = await jwt.sign(payload, process.env.specialKey,
    { expiresIn: 36000 });
  return { token };
};

const resetPassword = async (data) => {
  const admin = await Admin.findByPk(data.adminId);
  if (admin === null) throw new Error(`Admin with id ${data.adminId} does not exists`);
  const isMatch = await bcrypt.compare(data.oldPassword, admin[0].dataValues.password);
  if (!isMatch) throw new Error('Entered old  Password is Incorrect!');
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(data.newPassword, salt);
  await Admin.update({ password: newPassword, isSystemGenerated: false }, {
    where: {
      adminId: admin.adminId,
    },
  });
  return { message: 'Updated Password Successfully' };
};

const forgotPassword = async (data) => {
  const admin = await Admin.findAll({
    where: {
      email: data.email,
    },
  });
  if (admin.length > 0) {
    const newPassword = await generator.generate({
      length: 10,
      numbers: true,
    });
    const salt = await bcrypt.genSalt(10);
    const encyptedPassword = await bcrypt.hash(newPassword, salt);
    await Admin.update({ password: encyptedPassword, isSystemGenerated: true }, {
      where: {
        adminId: admin[0].dataValues.adminId,
      },
    });
    require('../utils/emailSender').sendUpdatedPasswordEmail(admin[0], newPassword);

    return { message: 'You will shortly receive an Email with your credentials' };
  }
  throw new Error(`Admin with email address ${data.email} Does Not Exists`);
};

module.exports = {
  addNewAdmin,
  findAdmin,
  findAllAdmins,
  updateAdminDetails,
  deleteAdmin,
  varifyAdmin,
  resetPassword,
  forgotPassword,
};
