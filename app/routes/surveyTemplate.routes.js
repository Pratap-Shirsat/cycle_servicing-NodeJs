module.exports = (app) => {
  const router = require('express').Router();
  const survey = require('../controllers/surveyTemplate.controller');
  const varify = require('../utils/verificationFunctions');
  const surveyReply = require('../controllers/surveyReply.controller');

  router.post('/:surveyId/question', varify.verifyAdminToken, varify.checkStatus, survey.addMoreQuestions);
  router.post('/:surveyId/send', varify.verifyAdminToken, varify.checkStatus, survey.sendSurvey);
  router.post('/question/:questionId/choice', varify.verifyAdminToken, varify.checkStatus, survey.addChoice);
  router.post('/response', varify.verifySurveyToken, varify.checkStatus, surveyReply.addSurveyResponse);
  router.post('/', varify.verifyAdminToken, varify.checkStatus, survey.addNewSurvey);

  router.get('/question_types', varify.verifyAdminToken, varify.checkStatus, survey.getQuestionTypes);
  router.get('/response/:responseId', varify.verifyAdminToken, varify.checkStatus, surveyReply.findSurveyResponse);
  router.get('/:surveyId/response', varify.verifyAdminToken, varify.checkStatus, surveyReply.allResponsesOfSurvey);
  router.get('/:surveyId', varify.verifyAdminToken, varify.checkStatus, survey.findSurvey);
  router.get('/', varify.verifyAdminToken, varify.checkStatus, survey.getAllSurveys);

  router.patch('/question/:questionId', varify.verifyAdminToken, varify.checkStatus, survey.updateQuestion);
  router.patch('/choice/:choiceId', varify.verifyAdminToken, varify.checkStatus, survey.updateChoice);
  router.patch('/:surveyId', varify.verifyAdminToken, varify.checkStatus, survey.modifySurveyTemplate);

  router.delete('/question/:questionId', varify.verifyAdminToken, varify.checkStatus, survey.removeQuestion);
  router.delete('/choice/:choiceId', varify.verifyAdminToken, varify.checkStatus, survey.removeChoice);
  router.delete('/response/:responseId', varify.verifyAdminToken, varify.checkStatus, surveyReply.deleteSurveyResponse);
  router.delete('/:surveyId', varify.verifyAdminToken, varify.checkStatus, survey.removeSurvey);

  app.use('/api/survey', router);
};
