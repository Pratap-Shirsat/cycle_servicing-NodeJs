const Status = require('http-status');

const validateTransactionSchema = require('./schemas/transaction.schema');
const transactionServices = require('../services/transaction.services');

const newTransaction = async (req, res) => {
  try {
    //  validate req
    const transaction = {
      modeOfTransaction: req.body.modeOfTransaction.trim(),
      amountPaid: req.body.amountPaid,
      referenceId: req.body.referenceId.trim(),
      dateOfTransaction: new Date().toISOString(),
      appointmentId: req.body.appointmentId.trim(),
      customerId: req.id,
    };
    const flag = validateTransactionSchema(transaction);
    if (flag.code) {
      const output = await transactionServices.addTransaction(transaction);
      res.status(Status.CREATED).send({ output });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findTransactionByid = async (req, res) => {
  try {
    //  validate req
    const transactionId = req.params.id.trim();
    const flag = validateTransactionSchema({ id: transactionId });
    if (flag.code) {
      const data = await transactionServices.searchTransaction(transactionId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findTransactionByFilter = async (req, res) => {
  try {
    //  validate req
    if (req.query.customerId) {
      const custId = req.query.customerId.trim();
      const flag = validateTransactionSchema({ customerId: custId });
      if (flag.code) {
        const data = await transactionServices.findTransactionOnCustomerId(custId);
        res.status(Status.OK).send({ data });
      }
      res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    } else if (req.query.date) {
      const date = req.query.date.trim();
      const flag = validateTransactionSchema({ dateOfTransaction: date });
      if (flag.code) {
        const data = await transactionServices.findTransactionOnDate(date);
        res.status(Status.OK).send({ data });
      }
      res.status(Status.BAD_REQUEST).send(flag.errorMessage);
    } else {
      const data = await transactionServices.allTransactions();
      res.status(Status.OK).send({ data });
    }
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    //  validate req
    const transactionId = req.params.id.trim();
    const details = {};
    if (req.body.modeOfTransaction) details.modeOfTransaction = req.body.modeOfTransaction.trim();
    if (req.body.referenceId) details.referenceId = req.body.referenceId.trim();

    const data = details;
    data.id = transactionId;
    const flag = validateTransactionSchema(data);
    if (flag.code) {
      const output = await transactionServices.updateTransaction(transactionId, details);
      res.status(Status.OK).send(output);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const removeTransaction = async (req, res) => {
  try {
    //  validate req
    const transactionId = req.params.id.trim();
    const flag = validateTransactionSchema({ id: transactionId });
    if (flag.code) {
      const data = await transactionServices.removeTransaction(transactionId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  newTransaction,
  findTransactionByid,
  findTransactionByFilter,
  updateTransaction,
  removeTransaction,
};
