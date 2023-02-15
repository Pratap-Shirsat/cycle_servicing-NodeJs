module.exports = (Sequelize, sequelizeDB) => {
  const surveyTemplate = sequelizeDB.define('surveytemplate', {
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
    },
    dateCreated: {
      type: Sequelize.DATEONLY,
      defaultValue: new Date(),
    },
    remarks: {
      type: Sequelize.STRING,
    },
    surveyDescription: {
      type: Sequelize.STRING,
    },
    isPublished: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  surveyTemplate.associate = (models) => {
    surveyTemplate.belongsTo(models.admin, { foreignKey: 'adminId' });
    surveyTemplate.hasMany(models.surveyqueue, { foreignKey: 'surveyId' });
    surveyTemplate.hasMany(models.surveyquestion, { foreignKey: 'surveyId' });
    surveyTemplate.hasMany(models.surveyresponse, { foreignKey: 'surveyId' });
  };
  return surveyTemplate;
};
