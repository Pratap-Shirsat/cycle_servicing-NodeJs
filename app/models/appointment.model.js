module.exports = (Sequelize, sequelize) => {
  const Appointment = sequelize.define('appointment', {
    appointmentId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    customerId: {
      type: Sequelize.UUID,
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
    },
    estimatedCost: {
      type: Sequelize.INTEGER,
    },
    serviceDuration: {
      type: Sequelize.STRING,
    },
    cycleId: {
      type: Sequelize.UUID,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    technicianId: {
      type: Sequelize.UUID,
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

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.technician, { foreignKey: 'technicianId' });
    Appointment.belongsTo(models.servicetype, { foreignKey: 'serviceId' });
    Appointment.belongsTo(models.customer, { foreignKey: 'customerId' });
    Appointment.hasMany(models.transaction, { foreignKey: 'appointmentId' });
  };

  return Appointment;
};
