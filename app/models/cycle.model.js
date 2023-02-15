module.exports = (Sequelize, sequelize) => {
  const Cycle = sequelize.define('cycle', {
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

  Cycle.associate = (models) => {
    Cycle.belongsTo(models.customer, { foreignKey: 'customerId' });
  };
  return Cycle;
};
