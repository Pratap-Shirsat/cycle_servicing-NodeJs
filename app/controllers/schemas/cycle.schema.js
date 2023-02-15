const Joi = require('joi');

const cycleSchema = Joi.object({
  id: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID for Cycle'),
  brand: Joi.string().trim().min(3).max(20)
    .regex(/^[A-Za-z]+$/)
    .message('Brand Name should Not Contain Special Characters or Numbers'),
  model: Joi.string().trim().min(3).max(20),
  color: Joi.string().trim().min(3).max(15)
    .regex(/^[A-Za-z\s]+$/)
    .message('Color Name should Not Contain Special Characters or Numbers'),
  customerId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID for Customer'),
  notes: Joi.string(),
});

const validateCycleSchema = (data) => {
  const { error } = cycleSchema.validate(data);
  if (error) {
    return { code: false, errorMessage: { error: error.details[0].message } };
  } return { code: true };
};

module.exports = validateCycleSchema;
