const jwt = require('jsonwebtoken');
const Status = require('http-status');

const verifyDefaultAdmin = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decodedData = await jwt.verify(bearerToken, process.env.specialKey);
      req.systemGenerated = false;
      if (decodedData.role === 'MAIN') return next();
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const verifyAdminToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decodedData = await jwt.verify(bearerToken, process.env.specialKey);
      if (decodedData.role === 'ADMIN' || decodedData.role === 'MAIN') {
        req.id = decodedData.adminId;
        req.systemGenerated = decodedData.isSystemGenerated;
        return next();
      }
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const verifyCustomerToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = await jwt.verify(bearerToken, process.env.specialKey);
      if (decoded.role === 'CUSTOMER') {
        req.systemGenerated = decoded.isSystemGenerated;
        req.id = decoded.customerId;
        return next();
      }
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const verifyTechnicianToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = await jwt.verify(bearerToken, process.env.specialKey);
      if (decoded.role === 'TECHNICIAN') {
        req.systemGenerated = decoded.isSystemGenerated;
        req.id = decoded.technicianId;
        return next();
      }
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const checkAdminToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = await jwt.verify(bearerToken, process.env.specialKey);
      if (decoded.role === 'ADMIN') {
        req.systemGenerated = decoded.isSystemGenerated;
        req.id = decoded.adminId;
        return next();
      }
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const checkStatus = (req, res, next) => {
  try {
    if (req.systemGenerated === false) return next();
    return res.status(Status.FORBIDDEN).send({ error: 'Please Reset your Password first to Continue' });
  } catch (err) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

const verifySurveyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = await jwt.verify(bearerToken, process.env.specialKey);
      req.surveyId = decoded.surveyId;
      if (decoded.customerId) req.customerId = decoded.customerId;
      else req.technicianId = decoded.technicianId;
      return next();
    }
    return res.status(Status.FORBIDDEN).send({ error: 'Access Denied' });
  } catch (error) {
    return res.status(Status.FORBIDDEN).send({ error: 'Token Expired' });
  }
};

module.exports = {
  verifyAdminToken,
  verifyCustomerToken,
  verifyTechnicianToken,
  checkAdminToken,
  verifyDefaultAdmin,
  checkStatus,
  verifySurveyToken,
};
