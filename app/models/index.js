const Sequilize = require('sequelize');

const dbConfig = require('../config/db.config');

const sequelizeDb = new Sequilize(dbConfig.DBNAME, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.DIALECT,
  pool: dbConfig.pool,
  define: {
    timestamps: false,
  },
});

const db = {};

db.Sequilize = Sequilize;
db.sequelize = sequelizeDb;

db.customer = require('./customer.model')(Sequilize, sequelizeDb);
db.technician = require('./technician.model')(Sequilize, sequelizeDb);
db.cycle = require('./cycle.model')(Sequilize, sequelizeDb);
db.servicetype = require('./service.model')(Sequilize, sequelizeDb);
db.appointment = require('./appointment.model')(Sequilize, sequelizeDb);
db.transaction = require('./transaction.model')(Sequilize, sequelizeDb);
db.admin = require('./admin.model')(Sequilize, sequelizeDb);
db.surveytemplate = require('./surveyTemplate.model')(Sequilize, sequelizeDb);
db.surveyquestion = require('./surveyQuestion.model')(Sequilize, sequelizeDb);
db.questionchoice = require('./questionChoice.model')(Sequilize, sequelizeDb);
db.surveyresponse = require('./surveyResponse.model')(Sequilize, sequelizeDb);
db.surveyansweer = require('./surveyAnsweer.model')(Sequilize, sequelizeDb);
db.surveyqueue = require('./surveyQueue.model')(Sequilize, sequelizeDb);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;
