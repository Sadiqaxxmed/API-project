const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {

    const { email, password, username, firstName, lastName } = req.body;
const err = {};

// Check if email or username already exists
const checkUserName = await User.findOne({ where: { username: username } });
const checkEmail = await User.findOne({ where: { email: email } });

if (checkEmail) {
    err.title = "Validation error";
    err.message = "User already exists";
    err.status = 403;
    err.errors = ["User with that email already exists"];
    return next(err);
}

if (checkUserName) {
    err.title = "Validation error";
    err.message = "User already exists";
    err.status = 403;
    err.errors = ["User with that username already exists"];
    return next(err);
}

// Validate input fields
if (!email || !username || !firstName || !lastName) {
    err.title = "Validation error";
    err.message = "Validation error";
    err.status = 400;
    err.errors = [];

    if (!email) err.errors.push("Invalid email");
    if (!username) err.errors.push("Invalid userName");
    if (!firstName) err.errors.push("Invalid firstName");
    if (!lastName) err.errors.push("Invalid lastName");

    return next(err);
}

// Create user
const user = await User.signup({ email, username, password, firstName, lastName });

// Generate token and set cookie
let token = await setTokenCookie(res, user);

return res.json({ user });

},
);





module.exports = router;
