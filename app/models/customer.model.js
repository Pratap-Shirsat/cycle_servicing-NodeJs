module.exports = (Sequelize, sequelize) => {
  const Customer = sequelize.define('customer', {
    customerId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
      required: true,
    },
    instaUsername: {
      type: Sequelize.STRING,
      unique: { args: true, msg: 'Instagram username should be unique' },
    },
    email: {
      type: Sequelize.STRING,
      unique: {
        args: true, msg: 'Email should be unique',
      },
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    address: {
      type: Sequelize.STRING,
      required: true,
    },
    isSystemGenerated: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    addressProofCategory: {
      type: Sequelize.ENUM,
      values: ['electionCard', 'drivingLicense', 'passport'],
    },
    addressProof: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    profilePic: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.cycle, { foreignKey: 'customerId' });
    Customer.hasMany(models.appointment, { foreignKey: 'customerId' });
    Customer.hasMany(models.transaction, { foreignKey: 'customerId' });
    Customer.hasMany(models.surveyresponse, { foreignKey: 'customerId' });
  };
  return Customer;
};
