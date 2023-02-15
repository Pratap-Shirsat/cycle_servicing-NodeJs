module.exports = (app) => {
  const router = require('express').Router();
  const appointment = require('../controllers/appointment.controller');
  const verification = require('../utils/verificationFunctions');

  //  add new appointment
  router.post('/', verification.verifyCustomerToken, verification.checkStatus, appointment.addAppointment);

  //  for customer
  router.get('/me', verification.verifyCustomerToken, verification.checkStatus, appointment.findMyAppointments);

  //  for technician
  router.get('/tech', verification.verifyTechnicianToken, verification.checkStatus, appointment.findAppointmentsTech);

  //  for admin
  router.get('/', verification.verifyAdminToken, verification.checkStatus, appointment.getAppointmentByFilter);

  //  update appointment details
  router.patch('/admin/:appointmentId', verification.verifyAdminToken, verification.checkStatus, appointment.approveAppointment);
  router.patch('/technician/:appointmentId', verification.verifyTechnicianToken, verification.checkStatus, appointment.updateStatusOfAppointment);
  router.patch('/:appointmentId', verification.verifyCustomerToken, verification.checkStatus, appointment.updateAppointment);

  //  delete an appointment
  router.delete('/:appointmentId', verification.verifyCustomerToken, verification.checkStatus, appointment.deleteAppointment);

  app.use('/api/appointment', router);
};
