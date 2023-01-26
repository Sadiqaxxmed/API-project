const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { validateSpot } = require('../../utils/validation');


//Get all spots
router.get('/', async (req, res, next) => {
  try {
      const spots = await Spot.findAll();
      return res.json({ spots });
  } catch (error) {
      return next(error);
  }
});

/// Create a spot
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


module.exports = router;
