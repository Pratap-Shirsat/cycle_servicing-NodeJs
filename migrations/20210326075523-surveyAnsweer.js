module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('surveyansweers', {
      surveyResponseId: {
        type: Sequelize.UUID,
        references: {
          model: 'surveyresponses',
          key: 'surveyResponseId',
        },
      },
      questionId: {
        type: Sequelize.UUID,
        references: {
          model: 'surveyquestions',
          key: 'questionId',
        },
      },
      reply: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      choiceId: {
        type: Sequelize.UUID,
        defaultValue: null,
        references: {
          model: 'questionchoices',
          key: 'choiceId',
        },
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('surveyansweers'),
};
