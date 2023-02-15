module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('transactions', {
      transactionId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      modeOfTransaction: {
        type: Sequelize.STRING,
        defaultValue: 'CASH',
      },
      referenceId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        unique: { args: true, msg: 'reference number should be unique' },
      },
      amountPaid: {
        type: Sequelize.FLOAT,
        required: true,
      },
      appointmentId: {
        type: Sequelize.UUID,
        references: {
          model: 'appointments',
          key: 'appointmentId',
        },
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'customerId',
        },
      },
      dateOfTransaction: {
        type: Sequelize.DATEONLY,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('transactions'),
};
