const LifestyleData = require('../models/LifestyleData');

// @desc    Save daily lifestyle data
// @route   POST /api/lifestyle
// @access  Private
exports.saveLifestyleData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, sleep, activity, screenTime, nutrition, stress, notes } = req.body;

    // Normalize date to start of day
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Check if entry exists for this date
    let lifestyleData = await LifestyleData.findOne({
      userId,
      date: normalizedDate
    });

    if (lifestyleData) {
      // Update existing entry
      lifestyleData = await LifestyleData.findOneAndUpdate(
        { userId, date: normalizedDate },
        { sleep, activity, screenTime, nutrition, stress, notes },
        { new: true, runValidators: true }
      );
    } else {
      // Create new entry
      lifestyleData = await LifestyleData.create({
        userId,
        date: normalizedDate,
        sleep,
        activity,
        screenTime,
        nutrition,
        stress,
        notes
      });
    }

    res.json({
      success: true,
      data: lifestyleData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get lifestyle data for date range
// @route   GET /api/lifestyle
// @access  Private
exports.getLifestyleData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, days = 30 } = req.query;

    let query = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const dateRange = new Date();
      dateRange.setDate(dateRange.getDate() - parseInt(days));
      query.date = { $gte: dateRange };
    }

    const lifestyleData = await LifestyleData.find(query)
      .sort({ date: 1 });

    res.json({
      success: true,
      count: lifestyleData.length,
      data: lifestyleData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get lifestyle data for specific date
// @route   GET /api/lifestyle/:date
// @access  Private
exports.getLifestyleDataByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const lifestyleData = await LifestyleData.findOne({
      userId,
      date: normalizedDate
    });

    if (!lifestyleData) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this date'
      });
    }

    res.json({
      success: true,
      data: lifestyleData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get lifestyle analysis (mock ML-ready data)
// @route   GET /api/lifestyle/analysis
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const dateRange = new Date();
    dateRange.setDate(dateRange.getDate() - parseInt(days));

    // Get lifestyle data for analysis
    const lifestyleData = await LifestyleData.find({
      userId,
      date: { $gte: dateRange }
    }).sort({ date: 1 });

    // Calculate mock analysis based on data
    const analysis = calculateMockAnalysis(lifestyleData);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to calculate mock analysis
// This is ready to be replaced with actual ML logic
const calculateMockAnalysis = (data) => {
  if (data.length === 0) {
    return {
      driftScore: 0,
      riskTrend: 'unknown',
      consistencyScore: 0,
      lifestyleState: 'insufficient_data',
      topContributors: [],
      message: 'Start tracking your lifestyle to get insights'
    };
  }

  // Calculate average sleep
  const sleepHours = data.filter(d => d.sleep?.hours).map(d => d.sleep.hours);
  const avgSleep = sleepHours.length > 0 
    ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length 
    : 0;

  // Calculate average steps
  const steps = data.filter(d => d.activity?.steps).map(d => d.activity.steps);
  const avgSteps = steps.length > 0 
    ? steps.reduce((a, b) => a + b, 0) / steps.length 
    : 0;

  // Calculate average screen time
  const screenTime = data.filter(d => d.screenTime?.totalHours).map(d => d.screenTime.totalHours);
  const avgScreenTime = screenTime.length > 0 
    ? screenTime.reduce((a, b) => a + b, 0) / screenTime.length 
    : 0;

  // Calculate consistency (how regular the data is)
  const consistencyScore = Math.min(100, Math.round((data.length / 30) * 100));

  // Calculate drift score (0-100, lower is better)
  // Mock calculation based on deviation from ideal values
  let driftScore = 0;
  
  if (avgSleep < 7 || avgSleep > 9) driftScore += 20;
  if (avgSteps < 10000) driftScore += 20;
  if (avgScreenTime > 4) driftScore += 20;
  
  // Random element for demo purposes
  driftScore += Math.floor(Math.random() * 20);

  // Determine risk trend
  let riskTrend = 'stable';
  if (driftScore > 50) riskTrend = 'increasing';
  else if (driftScore < 30) riskTrend = 'decreasing';

  // Determine lifestyle state
  let lifestyleState = 'moderate';
  if (driftScore < 25) lifestyleState = 'healthy';
  else if (driftScore > 60) lifestyleState = 'needs_attention';

  // Calculate top contributors
  const topContributors = [];
  
  if (avgSleep < 7 || avgSleep > 9) {
    topContributors.push({ factor: 'sleep', impact: 'high', message: 'Sleep outside recommended range' });
  }
  if (avgSteps < 10000) {
    topContributors.push({ factor: 'activity', impact: 'medium', message: 'Daily steps below 10,000' });
  }
  if (avgScreenTime > 4) {
    topContributors.push({ factor: 'screen_time', impact: 'medium', message: 'Screen time exceeds 4 hours' });
  }

  return {
    driftScore: Math.min(100, driftScore),
    riskTrend,
    consistencyScore,
    lifestyleState,
    topContributors,
    summary: {
      avgSleep: Math.round(avgSleep * 10) / 10,
      avgSteps: Math.round(avgSteps),
      avgScreenTime: Math.round(avgScreenTime * 10) / 10,
      daysTracked: data.length
    }
  };
};
