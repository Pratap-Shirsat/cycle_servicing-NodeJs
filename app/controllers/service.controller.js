const Status = require('http-status');

const Service = require('../services/service.services');
const validateServiceSchema = require('./schemas/service.schema');

const addService = async (req, res) => {
  try {
    //  validate req
    const service = {
      description: req.body.description.trim(),
      place: req.body.place.trim().toUpperCase(),
      cost: req.body.cost,
      duration: req.body.duration,
      transportCharges: req.body.transportCharges,
    };
    const flag = validateServiceSchema(service);
    if (flag.code) {
      const data = await Service.createService(service);
      res.status(Status.CREATED).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const getService = async (req, res) => {
  try {
    //  validate req
    const serviceId = req.params.id.trim();
    const flag = validateServiceSchema({ id: serviceId });
    if (flag.code) {
      const data = await Service.getService(serviceId);
      res.status(Status.OK).send({ data });
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const findServices = async (req, res) => {
  try {
    //  validate req
    if (req.query.place) {
      const place = parseInt(req.query.place, 10);
      if (place === 0) {
        const data = await Service.getServiceByPlace('WORKSTATION');
        res.status(Status.OK).send({ data });
      } else {
        const data = await Service.getServiceByPlace('ATDOORSTEP');
        res.status(Status.OK).send({ data });
      }
    } else {
      const output = await Service.findAllServices();
      res.status(Status.OK).send({ output });
    }
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    //  validate req
    const serviceId = req.params.id.trim();
    const service = {};
    if (req.body.description) service.description = req.body.description.trim();
    if (req.body.place) service.place = req.body.place.trim();
    if (req.body.cost) service.cost = req.body.cost;
    if (req.body.duration) service.duration = req.body.duration;
    if (req.body.transportCharges) service.transportCharges = req.body.transportCharges;
    const Data = service;
    Data.id = serviceId;
    const flag = validateServiceSchema(Data);
    if (flag.code) {
      const data = await Service.updateService(serviceId, service);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    //  validate req
    const serviceId = req.params.id.trim();
    const flag = validateServiceSchema({ id: serviceId });
    if (flag.code) {
      const data = await Service.removeService(serviceId);
      res.status(Status.OK).send(data);
    } else res.status(Status.BAD_REQUEST).send(flag.errorMessage);
  } catch (err) {
    res.status(Status.BAD_REQUEST).send({ Error: err.message });
  }
};

module.exports = {
  addService,
  getService,
  findServices,
  updateService,
  deleteService,
};
