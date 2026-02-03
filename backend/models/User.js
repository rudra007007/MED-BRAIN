const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingData: {
    ageRange: {
      type: String,
      enum: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    },
    routinePreferences: {
      type: String,
      enum: ['morning', 'evening', 'flexible']
    },
    goals: [{
      type: String,
      enum: [
        'improve_sleep',
        'increase_activity',
        'reduce_screen_time',
        'better_nutrition',
        'stress_management',
        'mental_health',
        'general_wellness'
      ]
    }],
    primaryFocus: {
      type: String,
      enum: ['sleep', 'activity', 'nutrition', 'stress', 'overall']
    }
  },
  preferences: {
    insightTone: {
      type: String,
      enum: ['encouraging', 'neutral', 'direct'],
      default: 'encouraging'
    },
    notifications: {
      enabled: { type: Boolean, default: true },
      dailyReminder: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
