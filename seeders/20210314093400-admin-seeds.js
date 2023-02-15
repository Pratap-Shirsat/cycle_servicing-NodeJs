module.exports = {
  up: async (queryInterface) => {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const password = 'seed579Password';
    const encrptedPassword = await bcrypt.hash(password, salt);
    return queryInterface.bulkInsert('admins', [{
      adminId: 'f4576875-a9a8-413c-a0a1-5c8b176cf7ed',
      firstName: ' ',
      lastName: ' ',
      designation: 'Super Admin',
      email: 'admin@admin.com',
      password: encrptedPassword,
      mobile: '1111111111',
      instaUsername: 'superAdmin579',
      aadhaarCardNumber: ' ',
      role: 'MAIN',
      isSystemGenerated: false,
    }]);
  },
  down: (queryInterface) => queryInterface.bulkDelete('admins', null, {}),
};
