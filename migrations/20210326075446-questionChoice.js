module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('questionchoices', {
      choiceId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      questionId: {
        type: Sequelize.UUID,
        references: {
          model: 'surveyquestions',
          key: 'questionId',
        },
      },
      option: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('questionchoices'),
};
