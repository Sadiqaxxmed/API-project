const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateBooking } = require('../../utils/validation');
const sequelize = require('sequelize');
const { bookingExists } = require('../../utils/error-handles')


//Get bookings for curr user

router.get("/current", requireAuth, async (req, res, next) => {
  const user = req.user;

  const bookings = await user.getBookings({
      include: [{
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [{
              model: SpotImage,
              attributes: ['url']
          }]
      }]
  });

  if (bookings.length === 0) {
      return res.json({
          message: "No bookings for current spot"
      })
  }

  const bookingsArr = bookings.map(booking => {
      booking = booking.toJSON();
      if (booking.Spot.SpotImages.length > 0) {
          for (let i = 0; i < booking.Spot.SpotImages.length; i++) {
              if (booking.Spot.SpotImages[i].preview === true) {
                  booking.Spot.previewImage = booking.Spot.SpotImages[i].url;
              }
          }
      }

      if (!booking.Spot.previewImage) {
          booking.Spot.previewImage = "No preview image available";
      }

      delete booking.Spot.SpotImages;
      return {
          id: booking.id,
          spotId: booking.spotId,
          Spot: booking.Spot,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
      }
  });

  res.json({
      Bookings: bookingsArr
  });
});


router.delete('/:bookingId', restoreUser, requireAuth, async (req, res, next) => {

  const { user } = req

  const bookingId = req.params.bookingId

  if(!bookingId || bookingId === 'null'){
      return res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
      })
  }

  const findBooking = await Booking.findByPk(bookingId)

  if(!findBooking){
      return res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
      })
  }

  if(findBooking.dataValues.userId !== user.id){
      return res.status(400).json({
          message: "Validation error",
          statusCode: 400
      })
  }

  if(new Date(findBooking.dataValues.startDate) <= new Date()){
      return res.status(403).json({
          message: "Bookings that have been started can't be deleted",
          statusCode: 403
      })
  }

  await findBooking.destroy()

  return res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200
  })

})

module.exports = router;
