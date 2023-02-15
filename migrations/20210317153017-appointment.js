module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('appointments', {
      appointmentId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'customerId',
        },
      },
      onDate: {
        type: Sequelize.DATEONLY,
      },
      atTime: {
        type: Sequelize.TIME,
      },
      deliveryDate: {
        type: Sequelize.DATEONLY,
        defaultValue: null,
      },
      deliveryTime: {
        type: Sequelize.TIME,
        defaultValue: null,
      },
      place: {
        type: Sequelize.STRING,
        defaultValue: 'WORKSTATION',
      },
      serviceId: {
        type: Sequelize.UUID,
        references: {
          model: 'servicetypes',
          key: 'serviceId',
        },
      },
      estimatedCost: {
        type: Sequelize.INTEGER,
      },
      serviceDuration: {
        type: Sequelize.STRING,
      },
      cycleId: {
        type: Sequelize.UUID,
        references: {
          model: 'cycles',
          key: 'cycleId',
        },
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      technicianId: {
        type: Sequelize.UUID,
        references: {
          model: 'technicians',
          key: 'technicianId',
        },
        defaultValue: null,
      },
      paidStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'NEW',
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('appointments'),
};
