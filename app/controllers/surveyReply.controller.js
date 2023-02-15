const Status = require('http-status');

const surveyServices = require('../services/surveyReply.services');
const ValidateSchema = require('./schemas/survey.schema');

const addSurveyResponse = async (req, res) => {
  try {
    const formData = { surveyId: req.surveyId };
    if (req.customerId) formData.customerId = req.customerId;
    else formData.technicianId = req.technicianId;
    if (req.body.feedback !== null) formData.feedback = req.body.feedback.trim();
    const surveyData = ValidateSchema(formData);
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const answeers = req.body.Answeers;
    const responseData = await surveyServices.storeFormResponse(surveyData.data, answeers);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const allResponsesOfSurvey = async (req, res) => {
  try {
    const surveyData = ValidateSchema({ surveyId: req.params.surveyId });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const surveyid = surveyData.data.surveyId;
    const responseData = await surveyServices.veiwFormResponses(surveyid);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findSurveyResponse = async (req, res) => {
  try {
    const surveyData = ValidateSchema({ responseId: req.params.responseId });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseid = surveyData.data.responseId;
    const responseData = await surveyServices.getFormResponse(responseid);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const deleteSurveyResponse = async (req, res) => {
  try {
    const surveyData = ValidateSchema({ responseId: req.params.responseId });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseid = surveyData.data.responseId;
    const responseData = await surveyServices.deleteFormResponse(responseid);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addSurveyResponse,
  allResponsesOfSurvey,
  findSurveyResponse,
  deleteSurveyResponse,
};
