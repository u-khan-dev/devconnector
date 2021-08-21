import express from 'express';
import gravatar from 'gravatar';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.js';
import sendToken from '../../utils/sendToken.js';

const router = express.Router();

// @route   POST api/v1/users
// @desc    Register user
// @access  Public

const userValidation = [
  check('name', 'name is required').not().isEmpty(),
  check('email', 'please include a valid email').isEmail(),
  check(
    'password',
    'please enter a password with 6 or more characters'
  ).isLength({ min: 6 })
];

router.post('/', userValidation, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200', // size
      r: 'pg', // rating
      d: 'mm' // default
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });

    await user.save();

    sendToken(user, 201, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

export default router;
