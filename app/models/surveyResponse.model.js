module.exports = (Sequelize, sequelizeDb) => {
  const surveyResponse = sequelizeDb.define('surveyresponse', {
    surveyResponseId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    surveyId: {
      type: Sequelize.UUID,
    },
    customerId: {
      type: Sequelize.UUID,
      defaultValue: null,
    },
    technicianId: {
      type: Sequelize.UUID,
      defaultValue: null,
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
  surveyResponse.associate = (models) => {
    surveyResponse.belongsTo(models.surveytemplate, { foreignKey: 'surveyId' });
    surveyResponse.belongsTo(models.customer, { foreignKey: 'customerId' });
    surveyResponse.belongsTo(models.technician, { foreignKey: 'technicianId' });
    surveyResponse.hasMany(models.surveyansweer, { foreignKey: 'surveyResponseId' });
  };
  return surveyResponse;
};
