module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('cycles', {
      cycleId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      brand: {
        type: Sequelize.STRING,
      },
      model: {
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      customerId: {
        type: Sequelize.UUID,
        required: true,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('cycles'),
};
