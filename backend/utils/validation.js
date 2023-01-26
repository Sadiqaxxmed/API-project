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

module.exports = {
  handleValidationErrors,
  validateSpot
};
