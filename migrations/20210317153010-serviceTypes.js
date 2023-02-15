module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('servicetypes', {
      serviceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
      },
      cost: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.TIME,
      },
      place: {
        type: Sequelize.STRING,
      },
      transportCharges: {
        type: Sequelize.INTEGER,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('servicetypes'),
};
