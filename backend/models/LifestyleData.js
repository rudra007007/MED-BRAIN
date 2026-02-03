const mongoose = require('mongoose');

const lifestyleDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  sleep: {
    hours: { type: Number, min: 0, max: 24 },
    quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
    bedtime: String,
    wakeTime: String
  },
  activity: {
    steps: { type: Number, min: 0 },
    activeMinutes: { type: Number, min: 0 },
    exerciseType: String,
    intensity: { type: String, enum: ['low', 'moderate', 'high'] }
  },
  screenTime: {
    totalHours: { type: Number, min: 0, max: 24 },
    beforeBed: { type: Boolean, default: false }
  },
  nutrition: {
    mealsSkipped: Number,
    waterIntake: { type: String, enum: ['low', 'moderate', 'good'] },
    caffeineIntake: Number
  },
  stress: {
    level: { type: String, enum: ['low', 'moderate', 'high'] },
    relaxationActivities: [String],
    mood: { type: String, enum: ['great', 'good', 'okay', 'low', 'stressed'] }
  },
  notes: String
}, {
  timestamps: true
});

// Compound index to prevent duplicate entries per user per date
lifestyleDataSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('LifestyleData', lifestyleDataSchema);
