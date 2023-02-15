const db = require('../models');

const ResponseSheetDb = db.surveyresponse;
const SurveyAnsweerDb = db.surveyansweer;
const SurveyTemplate = db.surveytemplate;

const storeFormResponse = async (formData, responseData) => {
  const surveyForm = await ResponseSheetDb.create(formData);
  for (let i = 0; i < responseData.length; i += 1) {
    const answeer = {
      surveyResponseId: surveyForm.surveyResponseId,
      questionId: responseData[i].questionId,
    };
    if (responseData[i].reply) {
      answeer.reply = responseData[i].reply.trim();
      await SurveyAnsweerDb.create(answeer);
    } else {
      for (let k = 0; k < responseData[i].choices.length; k += 1) {
        answeer.choiceId = responseData[i].choices[k];
        await SurveyAnsweerDb.create(answeer);
      }
    }
  }
  return 'Response stored Successfully';
};

const veiwFormResponses = async (surveyId) => {
  const surveyForm = await SurveyTemplate.findByPk(surveyId);
  if (surveyForm === null) throw new Error(`Survey form with id ${surveyId} Does Not Exists`);
  const responses = await ResponseSheetDb.findAll({
    where: {
      surveyId,
    },
    include: [{
      model: SurveyAnsweerDb,
      required: true,
      attributes: ['questionId', 'reply', 'choiceId'],
    }],
  });
  return responses;
};

const getFormResponse = (responseId) => ResponseSheetDb.findAll({
  where: {
    surveyResponseId: responseId,
  },
  include: [{
    model: SurveyAnsweerDb,
    required: true,
    attributes: ['questionId', 'reply', 'choiceId'],
  }],
});

const deleteFormResponse = async (responseId) => {
  await ResponseSheetDb.destroy({
    where: {
      surveyResponseId: responseId,
    },
  });
  return 'Deleted Response Successfully';
};

module.exports = {
  storeFormResponse,
  veiwFormResponses,
  getFormResponse,
  deleteFormResponse,
};
