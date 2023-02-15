module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('surveyresponses', {
      surveyResponseId: {
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
      customerId: {
        type: Sequelize.UUID,
        defaultValue: null,
        references: {
          model: 'customers',
          key: 'customerId',
        },
      },
      technicianId: {
        type: Sequelize.UUID,
        defaultValue: null,
        references: {
          model: 'technicians',
          key: 'technicianId',
        },
      },
      receivedOnDate: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
      },
      feedback: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('surveyresponses'),
};
