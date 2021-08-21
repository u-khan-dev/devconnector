import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';
import protect from '../../middleware/auth.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET api/v1/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile)
      return res
        .status(400)
        .json({ status: 'failure', message: 'no profile for this user' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   POST api/v1/profile
// @desc    Create or update a user profile
// @access  Private
const userValidation = [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
];

router.post('/', [protect, userValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    website,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
    ...rest
  } = req.body;

  // build profile object
  const profileFields = {
    user: req.user.id,

    website:
      website && website !== ''
        ? normalizeUrl(website, { forceHttps: true })
        : '',

    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => '' + skill.trim()),

    ...rest
  };

  // build social object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalizeUrl(value, { forceHttps: true });
  }

  profileFields.social = socialFields;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   GET api/v1/profile
// @desc    Get all user profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   GET api/v1/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ message: 'profile not found' });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId')
      return res.status(400).json({ message: 'profile not found' });

    return res.status(500).send('server error');
  }
});

// @route   DELETE api/v1/profile
// @desc    Delete profile, user, and posts
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });

    await Profile.findOneAndRemove({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ message: 'user deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   PUT api/v1/profile/experience
// @desc    Add profile experience
// @access  Private
const experienceValidation = [
  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
];

router.put('/experience', [protect, experienceValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = { title, company, location, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   DELETE api/v1/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   PUT api/v1/profile/education
// @desc    Add profile education
// @access  Private
const educationValidation = [
  check('school', 'school is required').not().isEmpty(),
  check('degree', 'degree is required').not().isEmpty(),
  check('fieldofstudy', 'field of study is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
];

router.put('/education', [protect, educationValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   DELETE api/v1/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route   GET api/v1/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      Autorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`
    };

    const githubResponse = await axios.get(uri, { headers });
    return res.json(githubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res
      .status(404)
      .json({ status: 'failure', messsage: 'no github profile found' });
  }
});

export default router;
