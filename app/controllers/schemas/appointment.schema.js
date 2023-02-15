const Joi = require('joi');

const appointmentSchema = Joi.object({
  id: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid Appointment UUID '),
  customerId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid Customer UUID '),
  technicianId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid Technician UUID '),
  serviceId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid Service UUID '),
  cycleId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid Cycle UUID '),
  atTime: Joi.string()
    .regex(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/)
    .message('Format for Time is HH:MM:SS'),
  onDate: Joi.date().iso().greater(Date.now()),
  deliveryTime: Joi.string()
    .regex(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/)
    .message('Format for Time is HH:MM:SS'),
  deliveryDate: Joi.date().iso(),
  status: Joi.string().min(3)
    .regex(/^[A-Za-z]+$/)
    .message('Status should Not Contain Special Characters or Numbers'),
  remarks: Joi.string(),
  place: Joi.string().trim().min(3).max(15)
    .regex(/^[A-Za-z]+$/)
    .message('place name should Not Contain Special Characters or Numbers'),
});

const validateAppointmentSchema = (data) => {
  const { error } = appointmentSchema.validate(data);
  if (error) {
    return { code: false, errorMessage: { error: error.details[0].message } };
  } return { code: true };
};

module.exports = validateAppointmentSchema;
