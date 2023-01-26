const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { id: userId } = req.user;

  const image = await SpotImage.findByPk(imageId);

  if (!image) {
      return next({
          title: "Couldn't find a Spot Image with the specified id",
          status: 404,
          message: "Spot Image couldn't be found"
      });
  }

  const spot = await image.getSpot();
  if (userId !== spot.ownerId) {
      return next({
          title: "Authorization error",
          status: 403,
          message: "Cannot delete image from spot not owned by user"
      });
  }

  await image.destroy();
  res.json({
      message: "Successfully deleted",
      statusCode: 200
  });

});

module.exports = router;
