module.exports = (Sequelize, sequelize) => {
  const Transaction = sequelize.define('transaction', {
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
      unique: { args: true, msg: 'Reference number should be unique' },
    },
    amountPaid: {
      type: Sequelize.FLOAT,
      required: true,
    },
    appointmentId: {
      type: Sequelize.UUID,
    },
    dateOfTransaction: {
      type: Sequelize.DATEONLY,
    },
  });

  Transaction.associates = (models) => {
    Transaction.belongsTo(models.customer, { foreignKey: 'customerId' });
    Transaction.belongsTo(models.appointment, { foreignKey: 'appointmentId' });
  };
  return Transaction;
};
