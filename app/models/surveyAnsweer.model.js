module.exports = (Sequelize, sequelizeDb) => {
  const surveyAnsweer = sequelizeDb.define('surveyansweer', {
    surveyResponseId: {
      type: Sequelize.UUID,
    },
    questionId: {
      type: Sequelize.UUID,
    },
    reply: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    choiceId: {
      type: Sequelize.UUID,
      defaultValue: null,
    },
  });

  surveyAnsweer.associate = (models) => {
    surveyAnsweer.belongsTo(models.surveyresponse, { foreignKey: 'surveyResponseId' });
    surveyAnsweer.belongsTo(models.surveyquestion, { foreignKey: 'questionId' });
    surveyAnsweer.belongsTo(models.questionchoice, { foreignKey: 'choiceId' });
  };
  return surveyAnsweer;
};
