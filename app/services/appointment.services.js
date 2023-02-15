const db = require('../models');

const Appointment = db.appointment;
const Customer = db.customer;
const Service = db.servicetype;
const Cycle = db.cycle;
const Technician = db.technician;

const createAppointment = async (details) => {
  const Details = details;
  const customer = await Customer.findByPk(details.customerId);
  if (customer === null) throw new Error(`Customer with id  ${details.customerId} does Not Exists`);
  const cycle = await Cycle.findByPk(details.cycleId);
  if (cycle === null) throw new Error(`Cycle with id  ${details.cycleId} does Not Exists`);
  const service = await Service.findByPk(details.serviceId);
  if (service === null) throw new Error(`Service with id  ${details.serviceId} does Not Exists`);
  Details.place = service.place;
  const totalCost = service.cost + service.transportCharges;
  Details.estimatedCost = totalCost;
  Details.serviceDuration = service.duration;

  //  add appointment data to database
  return Appointment.create(Details);
};

const findAllAppointments = () => Appointment.findAll();

const findAppointment = async (id, code) => {
  //  find appointment from database based on id
  const appointment = await Appointment.findByPk(id);
  if (code === true && appointment !== null) return { appointmentStatus: appointment.status };
  return appointment;
};

const customerAppointment = (custId) => Appointment.findAll({
  where: {
    customerId: custId,
  },
});

const findAppointmentByStatus = (stats) => Appointment.findAll({
  where: {
    status: stats,
  },
});

const findAppointmenyByDate = async (date, place) => {
  let Place;
  if (place === 0) Place = 'WORKSTATION';
  else Place = 'ATDOORSTEP';
  //  find appointment from database based on date
  return Appointment.findAll({
    where: {
      onDate: date,
      place: Place,
    },
  });
};

const findAppointmentForTechnician = (techId) => Appointment.findAll({
  where: {
    technicianId: techId,
  },
});

const updateStatus = async (appointmentId, statusUpdate) => {
  const d = await Appointment.update({ status: statusUpdate }, {
    where: {
      appointmentId,
    },
  });
  if (d[0] > 0) return { message: `Updated Status of Appointment to ${statusUpdate}` };
  throw new Error(`Appointment wit id ${appointmentId} Not Found`);
};

const updateAppointment = async (appointmentId, data) => {
  //  check if appointment exists
  const Data = data;
  const appointment = await Appointment.findByPk(appointmentId);
  if (appointment != null) {
    if (data.cycleId) {
      const cycle = await Cycle.findByPk(data.cycleId);
      if (cycle === null) throw new Error(`Cycle with id  ${data.cycleId} does Not Exists`);
    }
    if (data.serviceId) {
      const service = await Service.findByPk(data.serviceId);
      if (service === null) throw new Error(`Service with id  ${data.serviceId} does Not Exists`);
      const totalCost = service.cost + service.transportCharges;
      Data.estimatedCost = totalCost;
      Data.serviceDuration = service.duration;
      Data.place = service.place;
    }
    // update appointment details
    await Appointment.update(Data, {
      where: {
        appointmentId: appointment.appointmentId,
      },
    });
    return { message: `Appointment data updated successfully for ${appointmentId}` };
  }
  throw new Error(`Appointment with id ${appointmentId} does Not Exists`);
};

const appointmentUpdation = async (appointmentId, data) => {
  //  check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);
  if (appointment != null) {
    if (data.technicianId) {
      const technician = await Technician.findByPk(data.technicianId);
      if (technician === null) throw new Error(`Technician with id  ${data.technicianId} does Not Exists`);
    }
    // update appointment details
    await Appointment.update(data, {
      where: {
        appointmentId: appointment.appointmentId,
      },
    });
    return { message: `Appointment data updated successfully for ${appointmentId}` };
  }
  throw new Error(`Appointment with id ${appointmentId} does Not Exists`);
};

const removeAppointment = async (appointmentId) => {
  // delete appointment from database
  const d = await Appointment.destroy({
    where: {
      appointmentId,
    },
  });
  if (d > 0) return { message: `deleted Appointment with id ${appointmentId}` };
  throw new Error(`Appointment with id ${appointmentId} Does Not Exists`);
};

module.exports = {
  createAppointment,
  findAppointment,
  findAllAppointments,
  findAppointmentByStatus,
  updateAppointment,
  appointmentUpdation,
  removeAppointment,
  customerAppointment,
  findAppointmenyByDate,
  updateStatus,
  findAppointmentForTechnician,
};
