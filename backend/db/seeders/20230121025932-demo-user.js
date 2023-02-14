'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Derrick',
        lastName: 'Mane',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'drizzydrake@user.io',
        username: 'DrizzyDrake',
        firstName: 'Drake',
        lastName: 'Aubrey',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'yewest@user.io',
        username: 'yeWestt',
        firstName: 'Kanye',
        lastName: 'West',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'liluziii@user.io',
        username: 'vertttuzi',
        firstName: 'liluziii',
        lastName: 'vertttt',
        hashedPassword: bcrypt.hashSync('uzivert300')
      },
      {
        email: 'babykeem@user.io',
        username: 'babykeem',
        firstName: 'babyyy',
        lastName: 'keeeem',
        hashedPassword: bcrypt.hashSync('babyhim250')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'DrizzyDrake', 'yeWestt', 'vertttuzi', 'babykeem'] }
    }, {});
  }
};
