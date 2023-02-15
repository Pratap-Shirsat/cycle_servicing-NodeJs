module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('surveytemplates', {
      surveyId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      surveyName: {
        type: Sequelize.STRING,
        required: true,
      },
      adminId: {
        type: Sequelize.UUID,
        references: {
          model: 'admins',
          key: 'adminId',
        },
      },
      dateCreated: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
      },
      surveyDescription: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.STRING,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('surveytemplates'),
};
