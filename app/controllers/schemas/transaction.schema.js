const Joi = require('joi');

const transactionSchema = Joi.object({
  id: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID for Transaction'),
  customerId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID for Customer'),
  modeOfTransaction: Joi.string().trim().min(4).max(20)
    .regex(/^[A-Za-z\s]+$/)
    .message('Mode of Transaction should Not Contain Special Characters or Numbers'),
  amountPaid: Joi.number().positive(),
  referenceId: Joi.string().trim().min(7).max(30)
    .regex(/^[A-Za-z0-9\s]+$/)
    .message('Reference number or id should Not Contain Special Characters'),
  appointmentId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID for appointment'),
  dateOfTransaction: Joi.date().iso(),
});

const validateTransactionSchema = (data) => {
  const { error } = transactionSchema.validate(data);
  if (error) {
    return { code: false, errorMessage: { error: error.details[0].message } };
  } return { code: true };
};

module.exports = validateTransactionSchema;
