module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('technicians', {
      technicianId: {
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
        unique: { args: true, msg: 'Instagram username is already taken' },
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        unique: { args: true, msg: 'Email should be unique' },
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      aadhaarCardNumber: {
        type: Sequelize.STRING,
        unique: { args: true, msg: 'Aadhaar card number should be unique' },
        required: true,
      },
      isSystemGenerated: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      aadhaarcardproof: {
        type: Sequelize.STRING,
      },
      pancard: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('technicians'),
};
