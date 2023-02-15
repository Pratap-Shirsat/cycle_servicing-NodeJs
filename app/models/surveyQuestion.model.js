module.exports = (Sequelize, sequelizeDb) => {
  const surveyQuestion = sequelizeDb.define('surveyquestion', {
    questionId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    surveyId: {
      type: Sequelize.UUID,
    },
    questionType: {
      type: Sequelize.ENUM,
      values: ['shortAnsweer', 'singleChoice', 'multipleChoice', 'longAnsweer'],
    },
    questionStatement: {
      type: Sequelize.STRING,
    },
    isRequired: {
      type: Sequelize.BOOLEAN,
    },
  });

  surveyQuestion.associate = (models) => {
    surveyQuestion.hasMany(models.questionchoice, { foreignKey: 'questionId' });
    surveyQuestion.belongsTo(models.surveytemplate, { foreignKey: 'surveyId' });
    surveyQuestion.hasMany(models.surveyansweer, { foreignKey: 'questionId' });
  };
  return surveyQuestion;
};
