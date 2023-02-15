const Joi = require('joi');

const technicianSchema = Joi.object({
  id: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid UUID '),
  firstName: Joi.string().trim().min(3).max(20)
    .regex(/^[A-Za-z]+$/)
    .message('First Name should Not Contain Special Characters or Numbers'),
  lastName: Joi.string().trim().min(3).max(20)
    .regex(/^[A-Za-z]+$/)
    .message('Last Name should Not Contain Special Characters or Numbers'),
  mobile: Joi.string().trim().min(10).max(12)
    .regex(/^[0-9]+$/)
    .message('Phone Number should Not Contain Special Characters or Alphabets'),
  instaUsername: Joi.string().trim()
    .regex(/^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
    .message('Not a Valid Instagram Username'),
  email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'co'] } }).message('Email address is Not Valid'),
  oldPassword: Joi.string().trim().min(8).max(20),
  newPassword: Joi.string().min(8).max(20),
  password: Joi.string().trim().min(8).max(20),
  aadhaarCardNumber: Joi.string().regex(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/).message('Aadhar card number is Not valid'),
});

const validateTechnicianSchema = (data) => {
  const { error } = technicianSchema.validate(data);
  if (error) {
    return { code: false, errorMessage: { error: error.details[0].message } };
  } return { code: true };
};

module.exports = validateTechnicianSchema;
