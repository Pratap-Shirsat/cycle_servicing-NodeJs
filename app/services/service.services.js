const db = require('../models');

const Service = db.servicetype;

const createService = (details) => Service.create(details);

const findAllServices = () => Service.findAll();

const getService = (id) => Service.findByPk(id);

const getServiceByPlace = (place) => Service.findAll({
  where: {
    place,
  },
});

const updateService = async (serviceId, data) => {
  //  check if service exists
  const service = await Service.findByPk(serviceId);
  if (service != null) {
    // update service details
    await Service.update(data, {
      where: {
        serviceId: service.serviceId,
      },
    });
    return { message: `Service data updated successfully for ${serviceId}` };
  }
  throw new Error(`Service with id ${serviceId} does Not Exists`);
};

const removeService = async (serviceId) => {
  //  delete service from database
  const d = await Service.destroy({
    where: {
      serviceId,
    },
  });
  if (d > 0) return { message: `deleted Service with id ${serviceId}` };
  throw new Error(`Service with id ${serviceId} Does Not Exists`);
};

module.exports = {
  createService,
  getService,
  findAllServices,
  updateService,
  removeService,
  getServiceByPlace,
};
