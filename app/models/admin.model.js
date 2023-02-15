module.exports = (Sequelize, sequelize) => {
  const Admin = sequelize.define('admin', {
    adminId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    designation: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      unique: {
        args: true, msg: 'Email should be unique',
      },
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    mobile: {
      type: Sequelize.STRING,
      required: true,
    },
    instaUsername: {
      type: Sequelize.STRING,
      unique: { args: true, msg: 'Instagram username should be unique' },
    },
    aadhaarCardNumber: {
      type: Sequelize.STRING,
      unique: { args: true, msg: 'Aadhaar Card Number should be unique' },
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'ADMIN',
    },
    isSystemGenerated: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  Admin.associate = (models) => {
    Admin.hasMany(models.surveytemplate, { foreignKey: 'adminId' });
  };
  return Admin;
};
