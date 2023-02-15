const Status = require('http-status');

const appointmentService = require('../services/appointment.services');
const { checkDay, checkTime } = require('../utils/dateTimeFunctions');
const validateAppointmentSchema = require('./schemas/appointment.schema');

const addAppointment = async (req, res) => {
  try {
    //  validate req
    const appointment = {
      customerId: req.id.trim(),
      onDate: req.body.onDate.trim(),
      atTime: req.body.atTime.trim(),
      serviceId: req.body.serviceId.trim(),
      cycleId: req.body.cycleId.trim(),
      remarks: req.body.remarks.trim(),
    };
    const flag = validateAppointmentSchema(appointment);
    if (flag.code) {
      if (await checkDay(req.body.onDate.trim())) appointment.onDate = req.body.onDate.trim();
      else throw new Error('Applied Date is Sunday');
      if (await checkTime(req.body.atTime.trim())) appointment.atTime = req.body.atTime.trim();
      else throw new Error('Applied Time is Not in Working Hours');
      const data = await appointmentService.createAppointment(appointment);
      res.status(Status.CREATED).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

//  for customer
const findMyAppointments = async (req, res) => {
  try {
    //  validate req
    const customerId = req.id.trim();
    const flag = validateAppointmentSchema({ customerId });
    if (flag.code) {
      const data = await appointmentService.customerAppointment(customerId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findAppointmentsTech = async (req, res) => {
  try {
    //  validate req
    const technicianId = req.id.trim();
    const flag = validateAppointmentSchema({ technicianId });
    if (flag.code) {
      const data = await appointmentService.findAppointmentForTechnician(technicianId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

//  for admin only
const getAppointmentByFilter = async (req, res) => {
  try {
    if (req.query.appointmentId) {
      let statusCode = false;
      if (req.query.status) statusCode = true;
      const appointmentId = req.query.appointmentId.trim();
      const flag = validateAppointmentSchema({ id: appointmentId });
      if (flag.code) {
        const data = await appointmentService.findAppointment(appointmentId, statusCode);
        res.status(Status.OK).send({ data });
      } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    } else if (req.query.date && req.query.place) {
      //  validate req
      const place = parseInt(req.query.place, 10);
      const date = req.query.date.trim();
      const flag = validateAppointmentSchema({ onDate: date });
      if (flag.code) {
        const data = await appointmentService.findAppointmenyByDate(date, place);
        res.status(Status.OK).send({ data });
      } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    } else if (req.query.status) {
      const stats = req.query.status.trim().toUpperCase();
      const flag = validateAppointmentSchema({ status: stats });
      if (flag.code) {
        const data = await appointmentService.findAppointmentByStatus(stats);
        res.status(Status.OK).send({ data });
      } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    } else {
      const output = await appointmentService.findAllAppointments();
      res.status(Status.OK).send({ output });
    }
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateStatusOfAppointment = async (req, res) => {
  try {
    //  validate req
    const statusUpdate = req.body.status.trim().toUpperCase();
    const appointmentId = req.params.appointmentId.trim();
    const flag = validateAppointmentSchema({ status: statusUpdate, id: appointmentId });
    if (flag.code) {
      const data = await appointmentService.updateStatus(appointmentId, statusUpdate);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

//  for customer to  update appointment
const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId.trim();
    const appointment = {};
    //  validate req for Customer
    if (req.body.cycleId) appointment.cycleId = req.body.cycleId.trim();
    if (req.body.serviceId) appointment.serviceId = req.body.serviceId.trim();
    if (req.body.appointmentDate) appointment.appointmentDate = req.body.appointmentDate.trim();
    if (req.body.onDate) {
      if (await checkDay(req.body.onDate.trim())) appointment.onDate = req.body.onDate.trim();
      else throw new Error('Applied Date is Sunday');
    }
    if (req.body.atTime) {
      if (await checkTime(req.body.atTime.trim())) appointment.atTime = req.body.atTime.trim();
      else throw new Error('Applied Time is Not in Working Hours');
    }
    if (req.body.remarks) appointment.remarks = req.body.remarks;
    const Data = appointment;
    Data.id = appointmentId;
    const flag = validateAppointmentSchema(Data);
    if (flag.code) {
      const data = await appointmentService.updateAppointment(appointmentId, appointment);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

//  for admin only to update or approve appointment
const approveAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId.trim();
    const appointment = {};
    if (req.body.deliveryDate) appointment.deliveryDate = req.body.deliveryDate.trim();
    if (req.body.deliveryTime) appointment.deliveryTime = req.body.deliveryTime.trim();
    if (req.body.technicianId) appointment.technicianId = req.body.technicianId.trim();
    if (req.body.status) appointment.status = req.body.status.trim().toUpperCase();
    if (req.body.remarks) appointment.remarks = req.body.remarks.trim();
    const Data = appointment;
    Data.id = appointmentId;
    const flag = validateAppointmentSchema(Data);
    if (flag.code) {
      const data = await appointmentService.appointmentUpdation(appointmentId, appointment);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

//  for admins only
const deleteAppointment = async (req, res) => {
  try {
    //  validate req
    const appointmentId = req.params.appointmentId.trim();
    const flag = validateAppointmentSchema({ id: appointmentId });
    if (flag.code) {
      const data = await appointmentService.removeAppointment(appointmentId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addAppointment,
  updateAppointment,
  approveAppointment,
  deleteAppointment,
  findMyAppointments,
  getAppointmentByFilter,
  updateStatusOfAppointment,
  findAppointmentsTech,
};
