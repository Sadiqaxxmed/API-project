const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview, validateReviewImage } = require('../../utils/validation');
const sequelize = require('sequelize');
const { reviewExists, usersReview } = require('../../utils/error-handles')

//Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, reviewExists, usersReview, validateReviewImage, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user;

    const review = await Review.findByPk(reviewId);

    let allReviewImages = await review.getReviewImages();

    if (allReviewImages.length >= 10) {
      const error = new Error("Cannot add any more images because there is a maximum of 10 images per resource");
      error.message = "Maximum number of images for this resource was reached";
      error.status = 403;
      throw error;
    }

    const newReviewImage = await review.createReviewImage({
        url: url
    });

    res.json({
        id: newReviewImage.id,
        url: newReviewImage.url
    });
  } catch (error) {
    next(error);
  }
});

//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, reviewExists, usersReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  let editReview = await Review.findByPk(reviewId);

  editReview.review = review;
  editReview.stars = stars;

  await editReview.save();

  return res.json(editReview);
})


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
