const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { postType, content, optionalMetrics, isAnonymous } = req.body;

    const post = await Post.create({
      userId: req.user._id,
      userAlias: req.user.username,
      postType,
      content,
      optionalMetrics,
      isAnonymous: isAnonymous !== false
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get community feed
// @route   GET /api/community/posts
// @access  Private
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const { postType } = req.query;

    let query = {};

    if (postType) {
      query.postType = postType;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username');

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/community/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      userId: req.user._id,
      userAlias: req.user.username,
      content
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add reaction to post
// @route   POST /api/community/posts/:id/reactions
// @access  Private
exports.addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already reacted
    const existingReaction = post.reactions.find(
      r => r.userId.toString() === userId.toString()
    );

    if (existingReaction) {
      // Update existing reaction
      existingReaction.type = type;
    } else {
      // Add new reaction
      post.reactions.push({
        userId,
        type
      });
    }

    await post.save();

    res.json({
      success: true,
      data: post.reactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove reaction from post
// @route   DELETE /api/community/posts/:id/reactions
// @access  Private
exports.removeReaction = async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Remove user's reaction
    post.reactions = post.reactions.filter(
      r => r.userId.toString() !== userId.toString()
    );

    await post.save();

    res.json({
      success: true,
      data: post.reactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/community/my-posts
// @access  Private
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
