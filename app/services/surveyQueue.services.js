const JWT = require('jsonwebtoken');

const checkDate = require('../utils/dateTimeFunctions');

const EmailTo = require('../utils/emailSender');

const db = require('../models');

const QueueDb = db.surveyqueue;
const CustomerDb = db.customer;
const TechnicianDb = db.technician;

const sendTodaysScheduledEmails = async () => {
  const current = new Date();
  const today = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

  const allSchedules = await QueueDb.findAll({
    where: { isSent: false },
  });
  for (let i = 0; i < allSchedules.length; i += 1) {
    const OnDate = allSchedules[i].onDate;
    if (!checkDate.dateInFuture(OnDate, today)) {
      if (allSchedules[i].toUser === 0) {
        const customers = await CustomerDb.findAll({
          where: {
            isSystemGenerated: false,
          },
        });
        for (let j = 0; j < customers.length; j += 1) {
          const payload = {
            surveyId: allSchedules[i].surveyId,
            customerId: customers[j].customerId,
          };
          const accessToken = await JWT.sign(payload, process.env.specialKey,
            { expiresIn: process.env.expiryTime });
          const surveyLink = `${allSchedules[i].surveyLink}?access_token=${accessToken}`;
          await EmailTo.sendSurveyThroughEmail(customers[j], surveyLink);
        }
      } else {
        //  to technicians
        const technicians = await TechnicianDb.findAll({
          where: {
            isSystemGenerated: false,
          },
        });
        for (let k = 0; k < technicians.length; k += 1) {
          const payload = {
            surveyId: allSchedules[i].surveyId,
            technicianId: technicians[k].technicianId,
          };
          const accessToken = await JWT.sign(payload, process.env.specialKey,
            { expiresIn: process.env.expiryTime });
          const surveyLink = `${allSchedules[i].surveyLink}?access_token=${accessToken}`;
          await EmailTo.sendSurveyThroughEmail(technicians[k], surveyLink);
        }
      }
      //  delete the completed queued schedule
      await QueueDb.update({ isSent: true }, { where: { queueId: allSchedules[i].queueId } });
    }
  }
  console.log(`Did Survey schedule checkup of day : ${today} ,Successfully!`);
};

module.exports = { sendTodaysScheduledEmails };
