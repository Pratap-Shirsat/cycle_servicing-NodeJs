const db = require('../models');

const Transaction = db.transaction;
const Customer = db.customer;
const Appointment = db.appointment;

const addTransaction = async (transactionData) => {
  const customer = await Customer.findByPk(transactionData.customerId);
  if (customer === null) throw new Error(`Customer with id ${transactionData.customerId} does Not Exists`);
  const appointment = await Appointment.findByPk(transactionData.appointmentId);
  if (appointment === null) throw new Error(`Appointment with id ${transactionData.appointmentId} does Not Exists`);
  if (transactionData.amountPaid !== appointment.estimatedCost) throw new Error(`Service Estimated cost is  ${appointment.estimatedCost} ,but transaction amount receiving is ${transactionData.amountPaid} , thus transaction has been Cancelled.`);
  const transaction = await Transaction.create(transactionData);
  await Appointment.update({ paidStatus: true }, {
    where: {
      appointmentId: appointment.appointmentId,
    },
  });
  return transaction;
};

const allTransactions = () => Transaction.findAll();

const searchTransaction = (transId) => Transaction.findByPk(transId);

const findTransactionOnDate = (transactionDate) => Transaction.findAll({
  where: {
    dateOfTransaction: transactionDate,
  },
});

const findTransactionOnCustomerId = (custId) => Transaction.findAll({
  include: [{
    model: Appointment,
    where: {
      customerId: custId,
    },
  }],
});

const updateTransaction = async (transId, data) => {
  const transaction = await Transaction.findByPk(transId);
  if (transaction === null) throw new Error(`Transaction with id ${transId} does Not Exists`);
  await Transaction.update(data, {
    where: {
      transactionId: transId,
    },
  });
  return { message: `Updated Transaction with id ${transId} Successfully` };
};

const removeTransaction = async (transId) => {
  const transaction = await Transaction.findByPk(transId);
  if (transaction === null) throw new Error(`Transaction with id ${transId} does Not Exists`);
  await Transaction.destroy({
    where: {
      transactionId: transId,
    },
  });
  return { message: `Deleted Transaction with id ${transId} Successfully` };
};

module.exports = {
  addTransaction,
  allTransactions,
  findTransactionOnCustomerId,
  findTransactionOnDate,
  searchTransaction,
  updateTransaction,
  removeTransaction,
};
