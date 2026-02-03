const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userAlias: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userAlias: {
    type: String,
    required: true
  },
  postType: {
    type: String,
    enum: ['insight', 'progress', 'support'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  optionalMetrics: {
    sleepHours: Number,
    steps: Number,
    stressLevel: String,
    mood: String
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['support', 'encouraging', 'celebrate'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [commentSchema],
  isAnonymous: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for feed queries
postSchema.index({ createdAt: -1 });
postSchema.index({ postType: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
