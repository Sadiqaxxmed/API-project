
'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1133 Example Ave',
        city: 'Malibu',
        state: 'California',
        country: 'United States',
        lat: 47.60,
        lng: -122.33,
        name: 'EAGLES WATCH MALIBU- Architectural w/ Ocean View',
        description: "Eagle's Watch is one of Malibu's most famous houses.",
        price: 120
      },
      {
        ownerId: 1,
        address: '2211 Riverfront Drive',
        city: 'Sandy Valley',
        state: 'Nevada',
        country: 'United States',
        lat: 36.16,
        lng: -86.78,
        name: 'Conestoga Wagon on Dude Ranch NEAR LAS VEGAS',
        description: "Experience this awesome, authentic covered wagon located at Sandy Valley Ranch. We are located only 45 minutes away from Las Vegas.",
        price: 250
      },
      {
        ownerId: 2,
        address: '9821 Hillside Road',
        city: 'Crestone',
        state: 'Colorado',
        country: 'United States',
        lat: 35.22,
        lng: -80.83,
        name: 'Crestone Hobbitat',
        description: "Not just a getaway. A memorable, lifetime experience.",
        price: 150
      },
      {
        ownerId: 3,
        address: '1234 Beachside Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 25.76,
        lng: -80.19,
        name: 'Architectural X House',
        description: "Architectural Dream House. Custom built modern house with incredible design details. Three story house with roof deck.",
        price: 200
      },
    ], {});

  },
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['United States'] }
    }, {});
  }
};
