const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OP = require('sequelize').Op;
const generator = require('generate-password');

const db = require('../models');

const Technician = db.technician;
const Appointment = db.appointment;

const addTechnician = async (technicianData) => {
  //  add technician data to database
  const newPassword = await generator.generate({
    length: 10,
    numbers: true,
  });
  const salt = await bcrypt.genSalt(10);
  const techData = technicianData;
  techData.password = await bcrypt.hash(newPassword, salt);
  const technacian = await Technician.create(techData);
  require('../utils/emailSender').sendWelcomeMail(technacian, newPassword);

  return {
    technicianId: technacian.technicianId,
    firstName: technacian.firstName,
    lastName: technacian.lastName,
    mobile: technacian.mobile,
    instaUsername: technacian.instaUsername,
    email: technacian.email,
    aadhaarCardNumber: technacian.aadhaarCardNumber,
  };
};

const getTechnician = (id) => Technician.findByPk(id, { attributes: { exclude: ['password', 'role', 'isSystemGenerated', 'aadhaarcardproof', 'pancard', 'avatar'] } });

const findAllTechnicians = () => Technician.findAll({ attributes: { exclude: ['password', 'role', 'isSystemGenerated', 'avatar', 'aadhaarcardproof', 'pancard'] } });

const findAllWorkingTechnicians = () => Technician.findAll({
  include: [{
    model: Appointment,
    attributes: { exclude: ['password', 'role', 'isSystemGenerated', 'avatar', 'aadhaarcardproof', 'pancard'] },
    where: {
      status: 'INSERVICING',
    },
    required: true,
  }],
});

const findAllFreeTechnicians = () => Technician.findAll({
  include: [{
    model: Appointment,
    attributes: ['appointmentId', 'status'],
    where: {
      status: { [OP.in]: ['INSERVICING', 'CONFIRMED', 'DONE'] },
    },
    required: false,
  }],
  attributes: ['technicianId', 'firstName', 'lastName'],
});

const updateTechnicianData = async (techId, data) => {
  await Technician.update(data, {
    where: {
      technicianId: techId,
    },
  });
  return { message: 'Updated information successfully' };
};

const removeTechnician = async (techId) => {
  //  remove technician from database
  const c = await Technician.destroy({
    where: {
      technicianId: techId,
    },
  });
  if (c > 0) return { message: 'Technician removed Successfully' };
  throw new Error(`Technician with id ${techId} does Not Exists`);
};

const varifyTechnician = async (data) => {
  const technician = await Technician.findAll({
    where: {
      instaUsername: data.username,
    },
  });
  if (technician.length === 0) throw new Error(`The Technician with Username ${data.username} does Not Exists.`);
  const isMatch = await bcrypt.compare(data.password, technician[0].dataValues.password);
  if (!isMatch) throw new Error('Incorrect Password !');
  const payload = {
    role: 'TECHNICIAN',
    technicianId: technician[0].dataValues.technicianId,
    isSystemGenerated: technician[0].dataValues.isSystemGenerated,
  };
  return { token: await jwt.sign(payload, process.env.specialKey, { expiresIn: 36000 }) };
};

const resetPassword = async (data) => {
  const technician = await Technician.findByPk(data.technicianId);
  if (technician === null) throw new Error(`Technician with id ${data.technicianId} does not exists`);
  const isMatch = await bcrypt.compare(data.oldPassword, technician.dataValues.password);
  if (!isMatch) throw new Error('Entered old  Password is Incorrect!');
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(data.newPassword, salt);
  await Technician.update({ password: newPassword, isSystemGenerated: false }, {
    where: {
      technicianId: technician.technicianId,
    },
  });
  return { message: 'Updated Password Successfully' };
};

const forgotPassword = async (data) => {
  const technician = await Technician.findAll({
    where: {
      email: data.email,
    },
  });
  if (technician.length > 0) {
    const newPassword = await generator.generate({
      length: 10,
      numbers: true,
    });
    const salt = await bcrypt.genSalt(10);
    const encyptedPassword = await bcrypt.hash(newPassword, salt);
    await Technician.update({ password: encyptedPassword, isSystemGenerated: true }, {
      where: {
        technicianId: technician[0].dataValues.technicianId,
      },
    });
    require('../utils/emailSender').sendUpdatedPasswordEmail(technician[0], newPassword);

    return { message: 'You will shortly receive an Email with your credentials' };
  }
  throw new Error(`Technician with email address ${data.email} Does Not Exists`);
};

const updateAvatar = async (techId, avatarRef) => {
  const technician = await Technician.findByPk(techId);
  await Technician.update({ avatar: avatarRef }, {
    where: {
      technicianId: techId,
    },
  });
  return { previousAvatar: technician.avatar };
};

module.exports = {
  addTechnician,
  getTechnician,
  findAllTechnicians,
  updateTechnicianData,
  removeTechnician,
  varifyTechnician,
  findAllWorkingTechnicians,
  findAllFreeTechnicians,
  resetPassword,
  forgotPassword,
  updateAvatar,
};
