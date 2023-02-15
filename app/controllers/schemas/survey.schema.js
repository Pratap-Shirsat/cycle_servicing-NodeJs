const Joi = require('joi');

const surveySchema = Joi.object({
  choiceId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not provided a Valid choice UUID'),
  adminId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not provided a Valid admin UUID'),
  customerId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a Valid customer UUID'),
  technicianId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Not a a Valid technician UUID'),
  surveyId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Survey id is not a Valid UUID'),
  questionId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Question id is not a Valid UUID'),
  responseId: Joi.string().trim().guid({ version: 'uuidv4' }).message('Response id is not a Valid UUID'),
  onDate: Joi.date().iso(),
  surveyName: Joi.string().trim(),
  surveyDescription: Joi.string().trim(),
  choice: Joi.string().trim(),
  remarks: Joi.string().trim(),
  feedback: Joi.string().trim(),
  toUser: Joi.number(),
  isPublished: Joi.boolean(),
  isRequired: Joi.boolean(),
});

const validateSurveyFormSchema = (data) => {
  const { error, value } = surveySchema.validate(data);
  if (error) {
    return { code: false, errorMessage: error.details[0].message };
  } return { code: true, data: value };
};

module.exports = validateSurveyFormSchema;
