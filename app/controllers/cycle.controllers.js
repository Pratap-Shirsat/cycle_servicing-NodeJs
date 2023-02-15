const Status = require('http-status');

const cycleServices = require('../services/cycle.services');
const validateCycleSchema = require('./schemas/cycle.schema');

const addNewCycle = async (req, res) => {
  try {
    //  validate req
    const cycle = {
      brand: req.body.brand.trim(),
      model: req.body.model.trim(),
      color: req.body.color.trim(),
      notes: req.body.notes.trim(),
      customerId: req.id.trim(),
    };
    const flag = validateCycleSchema(cycle);
    if (flag.code) {
      const output = await cycleServices.addCycle(cycle);
      res.status(Status.CREATED).send({ output });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findAllCycles = async (req, res) => {
  try {
    //  validate req
    const data = await cycleServices.getAllCycles();
    res.status(Status.OK).send({ data });
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getCycle = async (req, res) => {
  try {
    //  validate req
    const cycleId = req.params.cycleId.trim();
    const flag = validateCycleSchema({ id: cycleId });
    if (flag.code) {
      const data = await cycleServices.findCycle(cycleId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getMyCycles = async (req, res) => {
  try {
    //  validate req
    const customerId = req.id;
    const flag = validateCycleSchema({ customerId });
    if (flag.code) {
      const data = await cycleServices.findMyCycles(customerId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateCycle = async (req, res) => {
  try {
    //  validate req
    const cycleId = req.params.cycleId.trim();
    const customerId = req.id;
    const details = {};
    if (req.body.brand) details.brand = req.body.brand.trim();
    if (req.body.model) details.model = req.body.model.trim();
    if (req.body.color) details.color = req.body.color.trim();
    if (req.body.notes) details.notes = req.body.notes.trim();
    if (req.body.customerId) details.customerId = req.body.customerId.trim();
    const cycleData = details;
    cycleData.id = cycleId;
    cycleData.customerId = customerId;
    const flag = validateCycleSchema(cycleData);
    if (flag.code) {
      const output = await cycleServices.updateCycleDetails(cycleId, customerId, details);
      res.status(Status.OK).send(output);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const deleteCycle = async (req, res) => {
  try {
    //  validate req
    const cycleId = req.params.cycleId.trim();
    const customerId = req.id;
    const flag = validateCycleSchema({ id: cycleId });
    if (flag.code) {
      const data = await cycleServices.removeCycle(cycleId, customerId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addNewCycle,
  getCycle,
  findAllCycles,
  updateCycle,
  deleteCycle,
  getMyCycles,
};
