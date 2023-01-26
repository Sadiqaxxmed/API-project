const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

router.get('/', async (req, res, next) => {
  try {
      const spots = await Spot.findAll();
      return res.json({ spots });
  } catch (error) {
      return next(error);
  }
});


module.exports = router;
