
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
        ownerId: 2,
        address: '1133 Example Ave',
        city: 'Malibu',
        state: 'California',
        country: 'United States',
        lat: 47.60,
        lng: -122.33,
        name: 'EAGLES WATCH MALIBU',
        description: "Eagle's Watch is one of Malibu's most famous houses.",
        price: 350
      },
      {
        ownerId: 3,
        address: '2211 Riverfront Drive',
        city: 'Sandy Valley',
        state: 'Nevada',
        country: 'United States',
        lat: 36.16,
        lng: -86.78,
        name: 'Conestoga Wagon',
        description: "Experience this awesome, authentic covered wagon located at Sandy Valley Ranch. We are located only 45 minutes away from Las Vegas.",
        price: 155
      },
      {
        ownerId: 4,
        address: '9821 Hillside Road',
        city: 'Crestone',
        state: 'Colorado',
        country: 'United States',
        lat: 35.22,
        lng: -80.83,
        name: 'Crestone Hobbitat',
        description: "Not just a getaway. A memorable, lifetime experience.",
        price: 125
      },
      {
        ownerId: 2,
        address: '1234 Beachside Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 25.76,
        lng: -80.19,
        name: 'Architectural X House',
        description: "Architectural Dream House. Custom built modern house with incredible design details. Three story house with roof deck.",
        price: 300
      },
      {
        ownerId: 2,
        address: '1354 Airway Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 24.76,
        lng: -85.19,
        name: 'Haven',
        description: "Haven is a new standard in mountain cabin luxury.",
        price: 230
      },
      {
        ownerId: 5,
        address: '1527 Tiffany way',
        city: 'Stateline',
        state: 'Nevada',
        country: 'United States',
        lat: 89.76,
        lng: -54.19,
        name: 'Residence 206',
        description: "Tahoe Beach Club is a private lakefront community on Tahoes East Shore.",
        price: 1235
      },
      {
        ownerId: 1,
        address: '3025 Cresent st',
        city: 'Bass Lake',
        state: 'California',
        country: 'United States',
        lat: 65.76,
        lng: -32.19,
        name: 'Eagles Nest',
        description: "Welcome to Eagle's Nest, one of the most ideally located Lakefront homes on Bass Lake!",
        price: 750
      },
      {
        ownerId: 3,
        address: '1452 Host St',
        city: 'Dundee',
        state: 'Oregon',
        country: 'United States',
        lat: 12.76,
        lng: -97.19,
        name: 'Luxury Villa',
        description: "Welcome to Del Mar Villa, a 26,000+ sq ft luxury Italian Chateau inspired Villa on 46 acres in the heart of Oregon Wine County.",
        price: 3196
      },
      {
        ownerId: 5,
        address: '2143 Holiday Ave',
        city: 'Paradise Valley',
        state: 'Arizona',
        country: 'United States',
        lat: 65.76,
        lng: -20.19,
        name: 'Entire villa',
        description: "This gorgeous Scottsdale estate is designed to dazzle.",
        price: 2677
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
