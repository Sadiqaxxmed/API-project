const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};


const validateSpot = [
  check('address')
      .notEmpty()
      .withMessage('Please enter address'),
  check('city')
      .notEmpty()
      .withMessage('Please enter city'),
  check('state')
      .notEmpty()
      .withMessage('Please enter State'),
  check('country')
      .notEmpty()
      .withMessage('Please enter Country'),
  check('lat', "Latitude is not valid")
      .notEmpty()
      .withMessage('Latitude is not valid'),
  check('lng', "Longitude is not valid")
      .notEmpty()
      .withMessage('Longitude is not valid'),
  check('name')
      .notEmpty()
      .withMessage('Please enter name'),
  check('description')
      .notEmpty()
      .withMessage('Please enter Description'),
  check('price')
      .notEmpty()
      .withMessage('Please enter price per day'),
  handleValidationErrors
];

const validateSpotImage = [
  check('url')
      .notEmpty()
      .withMessage('url must be defined'),
  check('preview')
      .notEmpty()
      .isBoolean()
      .withMessage('preview must be a boolean value'),
  handleValidationErrors
];

const validateReview = [
  check('review')
      .notEmpty()
      .withMessage('Review text is required'),
  check('stars')
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

const validateReviewImage = [
  check('url')
      .notEmpty()
      .withMessage('url must be defined'),
  handleValidationErrors
];

const validateQuery = [
  check("page")
      .optional({ nullable: true })
      .isInt({ min: 1 })
      .withMessage("Page must be greater than or equal to 1"),
  check("size")
      .optional({ nullable: true })
      .isInt({ min: 1 })
      .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
      .optional({ nullable: true })
      .isDecimal()
      .withMessage("Maximum latitude is invalid"),
  check("minLat")
      .optional({ nullable: true })
      .isDecimal()
      .withMessage("Minimum latitude is invalid"),
  check("maxLng")
      .optional({ nullable: true })
      .isDecimal()
      .withMessage("Maximum longitude is invalid"),
  check("minLng")
      .optional({ nullable: true })
      .isDecimal()
      .withMessage("Minimum longitude is invalid"),
  check("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be greater or equal to 0"),
  check("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be greater or equal to 0"),
  handleValidationErrors
];


const validateBooking = [
    check('startDate')
        .notEmpty()
        .isDate()
        .withMessage('Start date must be a date'),
    check('endDate')
        .notEmpty()
        .isDate()
        .withMessage('End date must be a date and cannot be on or before start date'),
    handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSpotImage,
  validateReview,
  validateReviewImage,
  validateQuery,
  validateBooking
};
