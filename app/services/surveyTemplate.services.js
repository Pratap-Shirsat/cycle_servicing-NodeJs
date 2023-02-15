const JWT = require('jsonwebtoken');

const EmailTo = require('../utils/emailSender');

const checkDates = require('../utils/dateTimeFunctions');

const db = require('../models');

const TemplateDb = db.surveytemplate;
const SurveyQuestionDb = db.surveyquestion;
const ChoiceDb = db.questionchoice;
const CustomerDb = db.customer;
const TechnicianDb = db.technician;
const QueueDb = db.surveyqueue;

const addNewSurveyTemplate = async (surveyData, questions) => {
  const survey = await TemplateDb.create(surveyData);
  if (questions.length > 0) {
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].questionType === 'shortAnsweer' || questions[i].questionType === 'longAnsweer') {
        if (questions[i].options) throw new Error(`The question with statement '${questions[i].questionStatement}' with question type ${questions[i].questionType}'s can't have choices`);
      }
      const quest = {
        surveyId: survey.surveyId,
        questionType: questions[i].questionType,
        questionStatement: questions[i].statement.trim(),
        isRequired: questions[i].required,
      };
      const newQuestion = await SurveyQuestionDb.create(quest);
      if (questions[i].options) {
        for (let j = 0; j < questions[i].options.length; j += 1) {
          const option = {
            questionId: newQuestion.questionId,
            option: questions[i].options[j].trim(),
          };
          await ChoiceDb.create(option);
        }
      }
    }
  }
  return survey;
};

const addQuestions = async (surveyId, questions) => {
  const survey = await TemplateDb.findByPk(surveyId);
  if (questions.length > 0) {
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].questionType === 'shortAnsweer' || questions[i].questionType === 'longAnsweer') {
        if (questions[i].options) throw new Error(`The question with statement '${questions[i].questionStatement}' with question type ${questions[i].questionType}'s can't have choices`);
      }
      const quest = {
        surveyId: survey.surveyId,
        questionType: questions[i].questionType,
        questionStatement: questions[i].statement.trim(),
        isRequired: questions[i].required,
      };
      const newQuestion = await SurveyQuestionDb.create(quest);
      if (questions[i].options) {
        for (let j = 0; j < questions[i].options.length; j += 1) {
          const option = {
            questionId: newQuestion.questionId,
            option: questions[i].options[j].trim(),
          };
          await ChoiceDb.create(option);
        }
      }
    }
  }
  return 'Added Question/s Successfully';
};

const addOneChoice = async (questionId, choice) => {
  const question = await SurveyQuestionDb.findByPk(questionId);
  if (question.questionType === 'shortAnsweer' || question.questionType === 'longAnsweer') throw new Error(`The question with statement '${question.questionStatement}' with question type ${question.questionType}'s can't have choices`);
  const option = {
    questionId: question.questionId,
    option: choice.trim(),
  };
  await ChoiceDb.create(option);
  return 'Added Choice Successfully';
};

const FindSurvey = async (data) => {
  const surveyData = await TemplateDb.findAll({
    where: {
      surveyId: data.surveyId,
    },
    include: [{
      model: SurveyQuestionDb,
      required: true,
      attributes: ['questionId', 'questionType', 'questionStatement', 'isRequired'],
      include: [{
        model: ChoiceDb,
        attributes: ['choiceId', 'option'],
      }],
    }],
  });
  return surveyData;
};

const getAllSurveys = () => TemplateDb.findAll();

const updateSurveyTemplate = async (surveyId, updateData) => {
  const survey = await TemplateDb.findByPk(surveyId);
  if (survey === null) throw new Error(`Survey with Id ${surveyId} does Not Exists`);
  if (survey.isPublished === true) throw new Error(`Survey with id ${surveyId} hss already been published and now it cannot be modified`);
  await TemplateDb.update(updateData, {
    where: { surveyId },
  });
  return 'Updated Survey Successfully';
};

const modifyQuestion = async (questionId, qData) => {
  const question = await SurveyQuestionDb.findByPk(questionId);
  if (question === null) throw new Error(`Question with id ${questionId} does Not Exists`);
  await SurveyQuestionDb.update(qData, {
    where: { questionId },
  });
  return 'Updated question successfully;';
};

const modifyOption = async (optionId, choice) => {
  const option = await ChoiceDb.findByPk(optionId);
  if (option === null) throw new Error(`Question with id ${optionId} does Not Exists`);
  await ChoiceDb.update({ option: choice }, {
    where: { choiceId: optionId },
  });
  return 'Updated Choice successfully';
};

const deleteSurvey = async (surveyId) => {
  const survey = TemplateDb.findByPk(surveyId);
  if (survey === null) throw new Error(`Survey with Id ${surveyId} does Not Exists`);
  if (survey.isPublished === true) throw new Error(`Survey with id ${surveyId} hss already been published and now it cannot be deleted`);
  await TemplateDb.destroy({
    where: { surveyId },
  });
  return 'Deleted Survey Successfully';
};

const getQuestionTypes = () => SurveyQuestionDb.rawAttributes.questionType.values;

const deleteQuestion = async (questionId) => {
  await SurveyQuestionDb.destroy({
    where: { questionId },
  });
  return 'Deleted Question Successfully';
};

const deleteOption = async (choiceId) => {
  await ChoiceDb.destroy({
    where: { choiceId },
  });
  return 'Deleted Option Successfully';
};

const sendSurvey = async (surveyId, surveyLink, toUser, onDate) => {
  const survey = await TemplateDb.findByPk(surveyId);
  if (survey === null) throw new Error(`Survey with id ${surveyId} does not exists`);
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  if (checkDates.dateInFuture(onDate, today) && onDate.length !== 0) {
    //  add the entry in surveyQueue table
    const queue = {
      surveyId,
      onDate,
      toUser,
      surveyLink,
    };
    const surveyData = await QueueDb.create(queue);
    return surveyData;
  }

  //  to customers
  if (toUser === 0) {
    const customers = await CustomerDb.findAll({
      where: {
        isSystemGenerated: false,
      },
    });
    for (let i = 0; i < customers.length; i += 1) {
      const payload = {
        surveyId,
        customerId: customers[i].customerId,
      };
      const accessToken = await JWT.sign(payload, process.env.specialKey,
        { expiresIn: process.env.expiryTime });
      const newSurveyLink = `${surveyLink}?access_token=${accessToken}`;
      await EmailTo.sendSurveyThroughEmail(customers[i], newSurveyLink);
    }
  } else {
    //  to technicians
    const technicians = await TechnicianDb.findAll({
      where: {
        isSystemGenerated: false,
      },
    });
    for (let i = 0; i < technicians.length; i += 1) {
      const payload = {
        surveyId,
        technicianId: technicians[i].technicianId,
      };
      const accessToken = await JWT.sign(payload, process.env.specialKey,
        { expiresIn: process.env.expiryTime });
      const newsurveyLink = `${surveyLink}?access_token=${accessToken}`;
      await EmailTo.sendSurveyThroughEmail(technicians[i], newsurveyLink);
    }
  }
  return 'Sent Emails Successfully';
};

module.exports = {
  addNewSurveyTemplate,
  addQuestions,
  addOneChoice,
  getAllSurveys,
  FindSurvey,
  updateSurveyTemplate,
  modifyQuestion,
  modifyOption,
  getQuestionTypes,
  deleteSurvey,
  deleteQuestion,
  deleteOption,
  sendSurvey,
};
