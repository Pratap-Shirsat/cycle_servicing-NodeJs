const Joi = require('joi');

const serviceSchema = Joi.object({
  id: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID '),
  description: Joi.string().trim().min(3),
  place: Joi.string().trim().min(3).max(20)
    .regex(/^[A-Za-z]+$/)
    .message('Place name should Not Contain Special Characters or Numbers'),
  cost: Joi.number().positive(),
  duration: Joi.string()
    .regex(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/)
    .message('Format for Time is HH:MM:SS'),
  transportCharges: Joi.number().min(0),
});

const validateServiceSchema = (data) => {
  const { error } = serviceSchema.validate(data);
  if (error) {
    return { code: false, errorMessage: { error: error.details[0].message } };
  } return { code: true };
};

module.exports = validateServiceSchema;
