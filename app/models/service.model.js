module.exports = (Sequelize, sequelize) => {
  const ServiceType = sequelize.define('servicetype', {
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

  ServiceType.associate = (models) => {
    ServiceType.hasMany(models.appointment, { foreignKey: 'serviceId' });
  };
  return ServiceType;
};
