module.exports = (Sequelize, sequelizeDb) => {
  const surveyQueue = sequelizeDb.define('surveyqueue', {
    queueId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    surveyId: {
      type: Sequelize.UUID,
    },
    onDate: {
      type: Sequelize.DATEONLY,
    },
    toUser: {
      type: Sequelize.INTEGER,
    },
    surveyLink: {
      type: Sequelize.STRING,
    },
    isSent: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  surveyQueue.associate = (models) => {
    surveyQueue.belongsTo(models.surveytemplate, { foreignKey: 'surveyId' });
  };
  return surveyQueue;
};
