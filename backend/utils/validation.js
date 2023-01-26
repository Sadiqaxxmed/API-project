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


module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSpotImage,
  validateReview,
  validateReviewImage
};
