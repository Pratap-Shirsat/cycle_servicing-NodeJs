const express = require('express');

const bodyParser = require('body-parser');

const { CronJob } = require('cron');

const fs = require('fs');

require('dotenv').config();
const db = require('./app/models');

db.sequelize.sync();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('This is the Homepage of Cycle Servicing');
});
fs.mkdirSync('app/uploadedFiles/customer/', { recursive: true });
fs.mkdirSync('app/uploadedFiles/technician/', { recursive: true });

require('./app/routes/customer.routes')(app);
require('./app/routes/technician.routes')(app);
require('./app/routes/cycle.routes')(app);
require('./app/routes/service.routes')(app);
require('./app/routes/appointment.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/surveyTemplate.routes')(app);

app.get('*', (req, res) => {
  res.status(404).send('The requested API Not Found');
});
app.post('*', (req, res) => {
  res.status(404).send('The requested API Not Found');
});
app.delete('*', (req, res) => {
  res.status(404).send('The requested API Not Found');
});
app.patch('*', (req, res) => {
  res.status(404).send('The requested API Not Found');
});

const Job = new CronJob(process.env.scheduleTime, async () => {
  await require('./app/services/surveyQueue.services').sendTodaysScheduledEmails();
}, null, true, 'Asia/Kolkata');
Job.start();

const PORT = process.env.LOCALPORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Up on port ${PORT}`);
});
