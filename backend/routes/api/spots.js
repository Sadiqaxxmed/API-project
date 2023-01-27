const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { validateSpot, validateSpotImage, validateQuery } = require('../../utils/validation');

const { spotExists, usersSpot, convertDate } = require('../../utils/error-handles')



//Get all spots
router.get('/', validateQuery, async (req, res, next) => {

  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  let pagination = {};

  const defaultPage = 1;
  const defaultSize = 20;
  const maxPage = 10;
  const maxSize = 20;

  pagination.page = Number(page) || defaultPage;
  pagination.size = Number(size) || defaultSize;

  if (pagination.page > maxPage) {
    pagination.page = maxPage;
  }

  if (pagination.size > maxSize) {
    pagination.size = maxSize;
  }

  pagination.offset = pagination.size * (pagination.page - 1);

  const query = {
    where: {},
    include: [],
    ...pagination
  };

  const reviewInclude = {
    model: Review,
    attributes: ['stars']
  };
  query.include.push(reviewInclude);

  const imageInclude = {
    model: SpotImage,
    attributes: ['url', 'preview']
  };

  query.include.push(imageInclude);

  const latWhere = {}
  if (maxLat && !minLat) {
      latWhere.lat = {
      [Op.lte]: maxLat
    }
  } else if (!maxLat && minLat) {
      latWhere.lat = {
        [Op.gte]: minLat
    }
  } else if (maxLat && minLat) {
      latWhere.lat = {
        [Op.and]: {
        [Op.lte]: maxLat,
        [Op.gte]: minLat
    }
  }
}

  if (Object.keys(latWhere).length > 0) {
    query.where = {...query.where, ...latWhere};
  }

  const lngWhere = {}
  if (maxLng && !minLng) {
    lngWhere.lng = {
      [Op.lte]: maxLng
    }
  } else if (!maxLng && minLng) {
      lngWhere.lng = {
        [Op.gte]: minLng
    }
  } else if (maxLng && minLng) {
      lngWhere.lng = {
          [Op.and]: {
          [Op.lte]: maxLng,
          [Op.gte]: minLng
    }
  }
}

  if (Object.keys(lngWhere).length > 0) {
    query.where = {...query.where, ...lngWhere};
  }

  const priceWhere = {}
  if (maxPrice && !minPrice) {
      priceWhere.price = {
        [Op.lte]: maxPrice
    }
  } else if (!maxPrice && minPrice) {
      priceWhere.price = {
        [Op.gte]: minPrice
    }
  } else if (maxPrice && minPrice) {
      priceWhere.price = {
          [Op.and]: {
          [Op.lte]: maxPrice,
          [Op.gte]: minPrice
    }
  }
}

  if (Object.keys(priceWhere).length > 0) {
    query.where = {...query.where, ...priceWhere};
  }

  const spots = await Spot.findAll(query);

  const spotsArr = spots.map(spot => {
    const spotData = spot.toJSON();
    const { Reviews, SpotImages } = spotData;
    let avgRating = "No current ratings";
    if (Reviews.length > 0) {
        const sum = Reviews.reduce((acc, { stars }) => acc + stars, 0);
        avgRating = sum / Reviews.length;
    }
    spotData.avgRating = avgRating;
    let previewImage = "No preview image available";
    if (SpotImages.length > 0) {
        const previewImageData = SpotImages.find(({ preview }) => preview);
        if (previewImageData) {
            previewImage = previewImageData.url;
        }
    }
    spotData.previewImage = previewImage;
    delete spotData.Reviews;
    delete spotData.SpotImages;
    return spotData;
});

  if (!spotsArr.length) {
    res.json("Sorry, no current spots")
  } else {
    res.json({
        Spots: spotsArr,
        page: page,
        size: size
  });
}

  // try {
  //     const spots = await Spot.findAll();
  //     return res.json({ spots });
  // } catch (error) {
  //     return next(error);
  // }
});



//Get all spots from current user
router.get('/current', requireAuth, async (req, res, next) => {
  const user = req.user;

  // Use a join table to retrieve all spots that belong to the user
  const spots = await user.getSpots({
      include: [
          {
              model: Review,
              attributes: ['stars']
          },
          {
              model: SpotImage,
              attributes: ['url', 'preview']
          }
      ],
      through: {
          where: {
              userId: user.id
          }
      }
  });

  let ownedSpots = [];

  spots.forEach(spot => {
      let eachSpot = spot.toJSON();

      let count = spot.Reviews.length;
      let sum = 0;
      spot.Reviews.forEach((review) => sum += review.stars)
      let avg = sum / count;
      if (!avg) {
          avg = "No current ratings"
      };

      eachSpot.avgRating = avg;

      if (eachSpot.SpotImages.length > 0) {
          for (let i = 0; i < eachSpot.SpotImages.length; i++) {
              if (eachSpot.SpotImages[i].preview === true) {
                  eachSpot.previewImage = eachSpot.SpotImages[i].url;
              }
          }
      }

      if (!eachSpot.previewImage) {
          eachSpot.previewImage = "No preview image available";
      }

      if (!eachSpot.Reviews.length > 0) {
          eachSpot.Reviews = "No current reviews"
      }

      if (!eachSpot.SpotImages.length > 0) {
          eachSpot.SpotImages = "No current SpotImages"
      }

      delete eachSpot.SpotImages;
      delete eachSpot.Reviews;
      ownedSpots.push(eachSpot);
  })


  if (ownedSpots.length === 0) {
      res.json("Sorry, you don't own any spots")
  }

  res.json({
      Spots: ownedSpots
  })
});

//Get spot by spotid

router.get('/:spotId', spotExists, async (req, res, next) => {
  let { spotId } = req.params;
  let spot;

  try {
    spot = await Spot.findByPk(spotId);
    spot = spot.toJSON();
  } catch (error) {
    return res.status(400).json({ message: error.message });
}

  let count;
    try {
      count = await Review.count({
          where: {
          spotId: spotId
      }
    })
    } catch (error) {
        return res.status(400).json({ message: error.message });
  }
  spot.numReviews = count;

  let sum;
    try {
      sum = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (sum / count) {
    spot.avgStarRating = sum / count;
  } else {
    spot.avgStarRating = "No current ratings";
  }

  let spotImages;
  try {
    spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (spotImages.length > 0) {
    spot.SpotImages = spotImages;
  } else {
    spot.SpotImages = "No images listed"
}

  let owner;
  try {
    owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  spot.Owner = owner;

  return res.json(spot);

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

//Delete a spot
router.delete('/:spotId', requireAuth, spotExists, usersSpot, async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);
  const user = req.user;

  spot.destroy();
  res.json({
      message: "Successfully deleted",
      statusCode: 200
  })
})

module.exports = router;
