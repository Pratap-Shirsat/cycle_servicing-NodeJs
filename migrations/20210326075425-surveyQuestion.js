module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('surveyquestions', {
      questionId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      surveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'surveytemplates',
          key: 'surveyId',
        },
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
  },

  down: async (queryInterface) => queryInterface.dropTable('surveyquestions'),
};
