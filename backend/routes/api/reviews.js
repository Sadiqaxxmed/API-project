const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview, validateReviewImage } = require('../../utils/validation');
const sequelize = require('sequelize');
const { reviewExists, usersReview } = require('../../utils/error-handles')


//Delete review
router.delete("/:reviewId", requireAuth, reviewExists, usersReview, async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user;

  let review = await Review.findByPk(reviewId);

  review.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
