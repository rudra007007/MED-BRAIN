const { spawn } = require('child_process');
const path = require('path');

class PythonService {
  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python';
    this.enginePath = path.join(__dirname, '..', '..', 'Engine');
    this.useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';
  }

  /**
   * Execute a Python script from the Engine directory
   * @param {string} scriptPath - Path to the Python script relative to Engine directory
   * @param {Array} args - Command line arguments for the script
   * @param {Object} input - JSON data to pass to the script via stdin
   * @param {number} timeout - Timeout in milliseconds (default: 30000)
   * @returns {Promise} - Promise that resolves with the script output
   */
  async executePythonScript(scriptPath, args = [], input = null, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.enginePath, scriptPath);
      const python = spawn(this.pythonPath, [fullPath, ...args]);

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        python.kill('SIGTERM');
        reject(new Error(`Python script timed out after ${timeout}ms`));
      }, timeout);

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        clearTimeout(timeoutId);
        if (timedOut) return;

        if (code !== 0) {
          reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        } else {
          try {
            // Try to parse JSON output
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            // If not JSON, return raw output
            resolve({ output: stdout, raw: true });
          }
        }
      });

      python.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });

      // Send input data to Python script if provided
      if (input) {
        python.stdin.write(JSON.stringify(input));
        python.stdin.end();
      }
    });
  }

  /**
   * Extract symptoms from text using keyword matching and pattern recognition
   * @param {string} text - Text to analyze
   * @returns {Promise} - Promise that resolves with extracted symptoms
   */
  async extractSymptoms(text) {
    try {
      // Enhanced symptom extraction with keyword matching
      const symptomPatterns = {
        'headache': ['headache', 'head pain', 'migraine', 'head hurts', 'pain in head'],
        'fatigue': ['fatigue', 'tired', 'exhausted', 'no energy', 'exhaustion', 'drowsy', 'sleepy'],
        'dizziness': ['dizz', 'lightheaded', 'vertigo', 'spinning', 'unsteady'],
        'back pain': ['back pain', 'lower back', 'backache', 'sore back', 'lumbar'],
        'nausea': ['nausea', 'nauseous', 'sick to stomach', 'want to vomit'],
        'fever': ['fever', 'temperature', 'hot', 'febrile', 'chills'],
        'cough': ['cough', 'coughing', 'hacking'],
        'shortness of breath': ['shortness of breath', 'breathless', 'cant breathe', 'breathing difficulty', 'dyspnea'],
        'chest pain': ['chest pain', 'chest tightness', 'heart pain', 'angina'],
        'joint pain': ['joint pain', 'aching joints', 'arthralgia', 'sore joints'],
        'muscle pain': ['muscle pain', 'muscle ache', 'myalgia', 'body aches', 'sore muscles'],
        'sore throat': ['sore throat', 'throat pain', 'pharyngitis', 'scratchy throat'],
        'congestion': ['congestion', 'stuffy nose', 'nasal congestion', 'blocked nose'],
        'insomnia': ['insomnia', 'cant sleep', 'cant fall asleep', 'sleep problems', 'no sleep'],
        'anxiety': ['anxiety', 'anxious', 'nervous', 'panic', 'worry', 'stress'],
        'depression': ['depressed', 'depression', 'sad', 'hopeless', 'mood swings'],
        'heartburn': ['heartburn', 'acid reflux', 'indigestion', 'burning in chest'],
        'bloating': ['bloating', 'bloated', 'stomach bloating', 'gassiness'],
        'diarrhea': ['diarrhea', 'loose stools', 'watery stool', 'frequent bowel'],
        'constipation': ['constipation', 'cant poop', 'infrequent bowel', 'hard stool']
      };

      const textLower = text.toLowerCase();
      const extractedSymptoms = [];
      const words = textLower.split(/\s+/);

      // Check for symptom patterns
      for (const [symptom, patterns] of Object.entries(symptomPatterns)) {
        for (const pattern of patterns) {
          if (textLower.includes(pattern)) {
            // Check if this symptom is already added
            if (!extractedSymptoms.find(s => s.symptom === symptom)) {
              // Calculate confidence based on pattern match quality
              let confidence = 0.7;
              if (pattern.length > 10) confidence = 0.85;
              if (textLower.includes(`severe ${pattern}`) || textLower.includes(`very ${pattern}`)) {
                confidence = Math.min(0.95, confidence + 0.1);
              }

              extractedSymptoms.push({
                symptom,
                confidence: confidence,
                matchedPattern: pattern,
                position: textLower.indexOf(pattern)
              });
            }
            break;
          }
        }
      }

      // Sort by position in text
      extractedSymptoms.sort((a, b) => a.position - b.position);

      // Generate tokens and entities
      const result = {
        data: extractedSymptoms.map(s => ({
          raw: s.matchedPattern,
          normalized: s.symptom,
          confidence: s.confidence
        })),
        tokens: words,
        entities: extractedSymptoms,
        model: 'pattern-matching-v1',
        processingTime: Date.now()
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 50));

      return result;
    } catch (error) {
      throw new Error(`Symptom extraction failed: ${error.message}`);
    }
  }

  /**
   * Analyze drift in health data
   * @param {Array} healthData - Array of health data points
   * @returns {Promise} - Promise that resolves with drift analysis
   */
  async analyzeDrift(healthData) {
    try {
      if (!healthData || healthData.length === 0) {
        // Return a default analysis for empty data
        return {
          driftScore: 0.1,
          trend: 'stable',
          riskFactors: [],
          recommendations: ['Start tracking your health data to get personalized insights'],
          confidence: 0.5,
          dataPoints: 0
        };
      }

      // Calculate basic metrics
      const steps = healthData.map(d => d.steps || 0);
      const sleep = healthData.map(d => d.sleep_hours || 0);
      const heartRate = healthData.map(d => d.heart_rate || 70);
      const hrv = healthData.map(d => d.hrv || 50);

      // Calculate averages
      const avgSteps = steps.reduce((a, b) => a + b, 0) / steps.length;
      const avgSleep = sleep.reduce((a, b) => a + b, 0) / sleep.length;
      const avgHR = heartRate.reduce((a, b) => a + b, 0) / heartRate.length;
      const avgHRV = hrv.reduce((a, b) => a + b, 0) / hrv.length;

      // Calculate trends (compare recent half to earlier half)
      const midpoint = Math.floor(healthData.length / 2);
      const recentSteps = steps.slice(0, midpoint);
      const earlierSteps = steps.slice(midpoint);
      const recentSleep = sleep.slice(0, midpoint);
      const earlierSleep = sleep.slice(midpoint);

      const recentAvgSteps = recentSteps.reduce((a, b) => a + b, 0) / recentSteps.length;
      const earlierAvgSteps = earlierSteps.reduce((a, b) => a + b, 0) / earlierSteps.length;
      const recentAvgSleep = recentSleep.reduce((a, b) => a + b, 0) / recentSleep.length;
      const earlierAvgSleep = earlierSleep.reduce((a, b) => a + b, 0) / earlierSleep.length;

      // Calculate drift score
      let driftScore = 0;
      const riskFactors = [];
      const recommendations = [];

      // Steps trend
      const stepsChange = (recentAvgSteps - earlierAvgSteps) / (earlierAvgSteps || 1);
      if (stepsChange < -0.2) {
        driftScore += 0.3;
        riskFactors.push('reduced_physical_activity');
        recommendations.push('Try to increase daily steps gradually, aim for 10,000 steps per day');
      } else if (stepsChange > 0.2) {
        driftScore += 0.1;
      }

      // Sleep trend
      const sleepChange = (recentAvgSleep - earlierAvgSleep) / (earlierAvgSleep || 1);
      if (sleepChange < -0.15) {
        driftScore += 0.35;
        riskFactors.push('reduced_sleep');
        recommendations.push('Maintain a consistent sleep schedule, aim for 7-9 hours per night');
      } else if (sleepChange > 0.15) {
        driftScore += 0.1;
      }

      // HRV analysis
      if (avgHRV < 40) {
        driftScore += 0.2;
        riskFactors.push('elevated_stress');
        recommendations.push('Consider stress-reduction techniques like meditation or deep breathing');
      }

      // Heart rate analysis
      if (avgHR > 80) {
        driftScore += 0.15;
        riskFactors.push('elevated_heart_rate');
        recommendations.push('Regular exercise can help lower resting heart rate');
      }

      // Normalize drift score
      driftScore = Math.min(1, driftScore);

      // Determine trend
      let trend = 'stable';
      if (driftScore > 0.5) {
        trend = 'increasing';
      } else if (driftScore > 0.3) {
        trend = 'slight_increase';
      } else if (driftScore < 0.1) {
        trend = 'improving';
      }

      // Calculate confidence based on data quality
      const confidence = Math.min(0.95, 0.5 + (healthData.length / 20));

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 50));

      return {
        driftScore: Math.round(driftScore * 100) / 100,
        trend,
        riskFactors,
        recommendations: recommendations.length > 0 ? recommendations : ['Keep up the good work! Your health metrics are stable'],
        confidence: Math.round(confidence * 100) / 100,
        metrics: {
          avgSteps: Math.round(avgSteps),
          avgSleep: Math.round(avgSleep * 10) / 10,
          avgHeartRate: Math.round(avgHR),
          avgHRV: Math.round(avgHRV),
          stepsTrend: Math.round(stepsChange * 100) / 100,
          sleepTrend: Math.round(sleepChange * 100) / 100
        },
        dataPoints: healthData.length,
        analysisDate: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Drift analysis failed: ${error.message}`);
    }
  }

  /**
   * Get symptom relationships from the graph
   * @param {string} symptom - Symptom to find relationships for
   * @returns {Promise} - Promise that resolves with related symptoms
   */
  async getSymptomRelationships(symptom) {
    try {
      // Pre-defined symptom relationships based on medical knowledge
      const symptomRelationships = {
        'headache': {
          related: ['fatigue', 'dizziness', 'nausea', 'neck pain'],
          causes: ['stress', 'dehydration', 'lack of sleep', 'eye strain'],
          treatments: ['rest', 'hydration', 'pain relievers', 'dark room']
        },
        'fatigue': {
          related: ['headache', 'dizziness', 'insomnia', 'muscle pain'],
          causes: ['poor sleep', 'stress', 'anemia', 'depression'],
          treatments: ['adequate rest', 'balanced diet', 'exercise', 'stress management']
        },
        'dizziness': {
          related: ['headache', 'fatigue', 'nausea', 'blurred vision'],
          causes: ['low blood pressure', 'dehydration', 'inner ear issues', 'anxiety'],
          treatments: ['sit or lie down', 'hydration', 'slow movements', 'medical evaluation']
        },
        'back pain': {
          related: ['muscle pain', 'joint pain', 'stiffness'],
          causes: ['poor posture', 'heavy lifting', 'sedentary lifestyle', 'injury'],
          treatments: ['rest', 'heat/cold therapy', 'stretching', 'physical therapy']
        },
        'insomnia': {
          related: ['fatigue', 'anxiety', 'headache'],
          causes: ['stress', 'caffeine', 'irregular schedule', 'screen time'],
          treatments: ['sleep hygiene', 'relaxation techniques', 'consistent schedule', 'limit screens']
        },
        'anxiety': {
          related: ['insomnia', 'fatigue', 'headache', 'dizziness'],
          causes: ['stress', 'work pressure', 'life events', 'genetics'],
          treatments: ['therapy', 'meditation', 'exercise', 'breathing exercises']
        },
        'fever': {
          related: ['headache', 'fatigue', 'muscle pain', 'chills'],
          causes: ['infection', 'inflammation', 'heat exhaustion', 'vaccination'],
          treatments: ['rest', 'hydration', 'fever reducers', 'cool compress']
        },
        'nausea': {
          related: ['dizziness', 'headache', 'fatigue'],
          causes: ['food poisoning', 'motion sickness', 'pregnancy', 'infection'],
          treatments: ['rest', 'clear fluids', 'ginger', 'bland diet']
        }
      };

      const symptomLower = symptom.toLowerCase();
      let foundSymptom = null;

      // Find matching symptom in our database
      for (const [key, relationships] of Object.entries(symptomRelationships)) {
        if (symptomLower.includes(key) || key.includes(symptomLower)) {
          foundSymptom = key;
          break;
        }
      }

      if (foundSymptom) {
        return {
          symptom: foundSymptom,
          ...symptomRelationships[foundSymptom],
          timestamp: new Date().toISOString()
        };
      }

      // Default response for unknown symptoms
      return {
        symptom: symptom,
        related: ['fatigue', 'discomfort'],
        causes: ['various factors'],
        treatments: ['rest', 'hydration', 'consult healthcare provider'],
        note: 'This is a general suggestion. Please consult a healthcare professional for accurate advice.',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Symptom relationship lookup failed: ${error.message}`);
    }
  }

  /**
   * Generate pattern insights from symptom and health data
   * @param {Array} symptoms - Array of extracted symptoms
   * @param {Object} healthMetrics - Health metrics object
   * @returns {Promise} - Promise that resolves with insights
   */
  async generateInsights(symptoms, healthMetrics) {
    try {
      const insights = {
        patterns: [],
        correlations: [],
        recommendations: [],
        riskLevel: 'low'
      };

      // Analyze symptom patterns
      if (symptoms && symptoms.length > 0) {
        const symptomNames = symptoms.map(s => s.normalized || s.raw);
        
        // Check for common patterns
        if (symptomNames.includes('fatigue') && symptomNames.includes('insomnia')) {
          insights.patterns.push({
            type: 'sleep-related',
            description: 'Both fatigue and insomnia detected - possible sleep quality issues',
            severity: 'moderate'
          });
        }

        if (symptomNames.includes('headache') && symptomNames.includes('fatigue')) {
          insights.patterns.push({
            type: 'stress-related',
            description: 'Headache combined with fatigue may indicate stress or dehydration',
            severity: 'mild'
          });
        }

        if (symptomNames.includes('anxiety') && symptomNames.includes('insomnia')) {
          insights.correlations.push({
            type: 'mental-health',
            description: 'Anxiety and insomnia often相互影响',
            recommendation: 'Consider stress-reduction techniques before bed'
          });
        }
      }

      // Analyze health metrics
      if (healthMetrics) {
        if (healthMetrics.avgSleep < 6) {
          insights.recommendations.push('Your average sleep is below recommended levels. Try to get 7-9 hours per night.');
        }

        if (healthMetrics.avgSteps < 5000) {
          insights.recommendations.push('Consider increasing daily physical activity. Aim for at least 10,000 steps per day.');
        }
      }

      // Generate overall recommendations
      if (insights.patterns.length === 0) {
        insights.recommendations.push('Continue monitoring your symptoms and health metrics for personalized insights.');
      }

      // Calculate risk level
      if (insights.patterns.length >= 2) {
        insights.riskLevel = 'moderate';
      } else if (insights.patterns.length >= 1) {
        insights.riskLevel = 'low-moderate';
      }

      return {
        success: true,
        data: insights,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Insights generation failed: ${error.message}`);
    }
  }
}

module.exports = new PythonService();
