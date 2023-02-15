module.exports = (Sequelize, sequelizeDb) => {
  const questionChoice = sequelizeDb.define('questionchoice', {
    choiceId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    questionId: {
      type: Sequelize.UUID,
    },
    option: {
      type: Sequelize.STRING,
    },
  });

  questionChoice.associate = (models) => {
    questionChoice.belongsTo(models.surveyquestion, { foreignKey: 'questionId' });
    questionChoice.hasMany(models.surveyansweer, { foreignKey: 'choiceId' });
  };
  return questionChoice;
};
