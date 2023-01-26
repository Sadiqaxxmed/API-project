const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview, validateReviewImage } = require('../../utils/validation');
const sequelize = require('sequelize');
const { reviewExists, usersReview } = require('../../utils/error-handles')

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

// router.put('/:reviewId',
//   requireAuth,
//   validateReview,
//   async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         const { review, stars } = req.body;
//         const user = req.user;

//         // Check if review exists and belongs to user
//         const reviewToEdit = await Review.findOne({
//           where: { id: reviewId, userId: user.id }
//         });
//         if (!reviewToEdit) {
//           return res.status(404).json({ message: "Review not found or not belongs to user" });
//         }

//         // Update review
//         reviewToEdit.review = review;
//         reviewToEdit.stars = stars;
//         await reviewToEdit.save();

//         return res.json(reviewToEdit);
//     } catch (error) {
//         next(error);
//     }
// });

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
