const Status = require('http-status');

const surveyServices = require('../services/surveyTemplate.services');
const ValidateSchema = require('./schemas/survey.schema');

const addNewSurvey = async (req, res) => {
  try {
    const schemaData = {
      adminId: req.id,
      surveyName: req.body.surveyName,
      surveyDescription: req.body.description,
    };
    if (req.body.remarks) schemaData.remarks = req.body.remarks;
    const surveyData = ValidateSchema(schemaData);
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const surveyQuestions = req.body.questions;
    const responseData = await surveyServices.addNewSurveyTemplate(
      surveyData.data, surveyQuestions,
    );
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const addMoreQuestions = async (req, res) => {
  try {
    const survey = ValidateSchema({ surveyId: req.params.surveyId });
    if (survey.code === false) throw new Error(survey.errorMessage);
    const { surveyId } = survey.data;
    const { Questions } = req.body;
    const responseData = await surveyServices.addQuestions(surveyId, Questions);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const addChoice = async (req, res) => {
  try {
    const surveyData = ValidateSchema({
      questionId: req.params.questionId,
      choice: req.body.option,
    });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseData = await surveyServices.addOneChoice(
      surveyData.data.questionId, surveyData.data.choice,
    );
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findSurvey = async (req, res) => {
  try {
    const surveyData = ValidateSchema({
      surveyId: req.params.surveyId,
    });
    if (surveyData.code === false) throw surveyData.errorMessage;
    const responseData = await surveyServices.FindSurvey(surveyData.data);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getQuestionTypes = async (req, res) => {
  try {
    const responseData = await surveyServices.getQuestionTypes();
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getAllSurveys = async (req, res) => {
  try {
    const responseData = await surveyServices.getAllSurveys();
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const modifySurveyTemplate = async (req, res) => {
  try {
    const surveyId = req.params.surveyId.trim();
    const surveyData = {};
    if (req.body.surveyName) surveyData.surveyName = req.body.surveyName;
    if (req.body.isPublished) surveyData.isPublished = req.body.isPublished;
    if (req.body.remark) surveyData.remarks = req.body.remark;
    if (req.body.description) surveyData.surveyDescription = req.body.description;
    const surveyDataOk = ValidateSchema(surveyData);
    if (surveyDataOk.code === false) throw new Error(surveyDataOk.errorMessage);
    const responseData = await surveyServices.updateSurveyTemplate(surveyId, surveyDataOk.data);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId.trim();
    const questionData = {};
    if (req.body.statement) questionData.questionStatement = req.body.statement;
    if (req.body.required) questionData.isRequired = req.body.required;
    const surveyData = ValidateSchema(questionData);
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseData = await surveyServices.modifyQuestion(questionId, surveyData.data);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateChoice = async (req, res) => {
  try {
    const choiceId = req.params.choiceId.trim();
    const choiceData = ValidateSchema({
      choice: req.body.choice,
    });
    if (choiceData.code === false) throw new Error(choiceData.errorMessage);
    const responseData = await surveyServices.modifyOption(choiceId, choiceData.data.choice);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeSurvey = async (req, res) => {
  try {
    const surveyData = ValidateSchema({
      surveyId: req.params.surveyId,
    });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseData = await surveyServices.deleteSurvey(surveyData.data.surveyId);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeQuestion = async (req, res) => {
  try {
    const surveyData = ValidateSchema({
      questionId: req.params.questionId,
    });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseData = await surveyServices.deleteQuestion(surveyData.data.questionId);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeChoice = async (req, res) => {
  try {
    const surveyData = ValidateSchema({
      choiceId: req.params.choiceId,
    });
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const responseData = await surveyServices.deleteOption(surveyData.data.choiceId);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const sendSurvey = async (req, res) => {
  try {
    const ValData = {
      toUser: req.body.user,
      surveyId: req.params.surveyId,
    };
    if (req.body.onDate.length > 0) ValData.onDate = req.body.onDate;
    const hostLink = req.body.hostLink ? req.body.hostLink.trim() : process.env.hostLink;
    const surveyData = ValidateSchema(ValData);
    if (surveyData.code === false) throw new Error(surveyData.errorMessage);
    const touser = surveyData.data.toUser;
    const surveyid = surveyData.data.surveyId;
    const onDate = surveyData.data.onDate ? req.body.onDate.trim() : '';
    const surveyLink = `${hostLink}/${surveyid}`;
    const responseData = await surveyServices.sendSurvey(surveyid, surveyLink, touser, onDate);
    res.status(Status.OK).send({ data: responseData });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addNewSurvey,
  findSurvey,
  getQuestionTypes,
  getAllSurveys,
  modifySurveyTemplate,
  updateQuestion,
  updateChoice,
  removeSurvey,
  removeQuestion,
  removeChoice,
  addMoreQuestions,
  addChoice,
  sendSurvey,
};
