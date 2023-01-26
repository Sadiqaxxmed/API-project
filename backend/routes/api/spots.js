const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { validateSpot, validateSpotImage } = require('../../utils/validation');

const { spotExists, usersSpot, convertDate } = require('../../utils/error-handles')



//Get all spots
router.get('/', async (req, res, next) => {
  try {
      const spots = await Spot.findAll();
      return res.json({ spots });
  } catch (error) {
      return next(error);
  }
});

//Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  let user = req.user;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  let newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
  })

  res.status = 201;
  return res.json(newSpot)
})

//Adding spotImg to spotId
router.post('/:spotId/images', requireAuth, spotExists, usersSpot, validateSpotImage, async (req, res, next) => {
  let { spotId } = req.params;
  let { url, preview } = req.body;

  const user = req.user;

  const spot = await Spot.findByPk(spotId);

  let spotImage = await spot.createSpotImage({
      url: url,
      preview: preview
  })

  res.json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview
  });
})


//Edit a spot
router.put('/:spotId', requireAuth, spotExists, usersSpot, validateSpot, async (req, res, next) => {

  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(spotId);
  const user = req.user;

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save()

  res.json(spot);
})

module.exports = router;
