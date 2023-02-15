const db = require('../models');

const Cycle = db.cycle;
const Customer = db.customer;

const addCycle = async (details) => {
  const customer = await Customer.findByPk(details.customerId);
  if (customer != null) {
    //  add cycle data to database
    return Cycle.create(details);
  }
  throw new Error(`Customer with id ${details.customerId} does not Exists`);
};

const getAllCycles = () => Cycle.findAll();

const findCycle = (id) => Cycle.findByPk(id);

const findMyCycles = (id) => Cycle.findAll({
  where: {
    customerId: id,
  },
});

const updateCycleDetails = async (cycleId, customerId, data) => {
  //  check if cycle exists
  const cycle = await Cycle.findByPk(cycleId);
  if (cycle != null) {
    if (cycle.customerId !== customerId) throw new Error(`This Cycle belongs to customer wit id ${cycle.customerId}`);
    // update cycle details
    await Cycle.update(data, {
      where: {
        cycleId: cycle.cycleId,
      },
    });
    return { message: `cycle data updated successfully for ${cycleId}` };
  }
  throw new Error(`Cycle with id ${cycleId} does Not Exists`);
};

const removeCycle = async (cycleId, customerId) => {
  const cycle = await Cycle.findByPk(cycleId);
  if (cycle !== null) {
    if (cycle.customerId !== customerId) throw new Error(`This Cycle belongs to customer wit id ${cycle.customerId}`);
    //  delete cycle from database
    await Cycle.destroy({
      where: {
        cycleId,
      },
    });
    return { message: `deleted cycle with id ${cycleId}` };
  }
  throw Error(`Cycle with id ${cycleId} Does Not Exists`);
};

module.exports = {
  addCycle,
  getAllCycles,
  findCycle,
  updateCycleDetails,
  removeCycle,
  findMyCycles,
};
