module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('surveyqueues', {
      queueId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      surveyId: {
        type: Sequelize.UUID,
        references: {
          model: 'surveytemplates',
          key: 'surveyId',
        },
      },
      onDate: {
        type: Sequelize.DATEONLY,
      },
      toUser: {
        type: Sequelize.INTEGER,
      },
      surveyLink: {
        type: Sequelize.STRING,
      },
      isSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  down: async (queryInterface) => queryInterface.dropTable('surveyqueues'),
};
