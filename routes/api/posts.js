import express from 'express';
import { check, validationResult } from 'express-validator';
import protect from '../../middleware/auth.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

const router = express.Router();

// @route   POST api/v1/posts
// @desc    Create a post
// @access  Private
const postValidation = [check('text', 'text is required').not().isEmpty()];

router.post('/', [protect, postValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: user.id
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   GET api/v1/posts
// @desc    Get all posts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   GET api/v1/posts/:id
// @desc    Get a single post
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ status: 'failure', message: 'post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ status: 'failure', message: 'post not found' });
    }

    res.status(500).send('server error');
  }
});

// @route   DELETE api/v1/posts/:id
// @desc    Delete a single post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ status: 'failure', message: 'post not found' });
    }

    // ensure deletion is by user owning the post
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ status: 'failure', message: 'user not authorized' });
    }

    await post.remove();

    res.json({ status: 'success', message: 'post deleted' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ status: 'failure', message: 'post not found' });
    }

    res.status(500).send('server error');
  }
});

// @route   PUT api/v1/posts/like/:id
// @desc    Like a single post
// @access  Private
router.put('/like/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post has already been liked by this user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res
        .status(400)
        .send({ status: 'failure', message: 'post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   PUT api/v1/posts/unlike/:id
// @desc    Unlike a single post
// @access  Private
router.put('/unlike/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post has been liked by this user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res
        .status(400)
        .send({ status: 'failure', message: 'post has not yet been liked' });
    }

    // get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   POST api/v1/posts/comment/:id
// @desc    Comment on a post
// @access  Private
const commentValidation = [check('text', 'text is required').not().isEmpty()];

router.post('/comment/:id', [protect, commentValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: user.id
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   DELETE api/v1/posts/comment/:id/:comment_id
// @desc    Delete a Comment
// @access  Private
router.delete('/comment/:id/:comment_id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res
        .status(404)
        .json({ status: 'failure', message: 'comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ status: 'failure', message: 'user not authorized' });
    }

    // get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

export default router;
