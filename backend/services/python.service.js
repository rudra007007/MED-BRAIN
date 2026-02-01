const { spawn } = require('child_process');
const path = require('path');

class PythonService {
  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python';
    this.enginePath = path.join(__dirname, '..', '..', 'Engine');
  }

  /**
   * Execute a Python script from the Engine directory
   * @param {string} scriptPath - Path to the Python script relative to Engine directory
   * @param {Array} args - Command line arguments for the script
   * @param {Object} input - JSON data to pass to the script via stdin
   * @returns {Promise} - Promise that resolves with the script output
   */
  async executePythonScript(scriptPath, args = [], input = null) {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.enginePath, scriptPath);
      const python = spawn(this.pythonPath, [fullPath, ...args]);

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        } else {
          try {
            // Try to parse JSON output
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            // If not JSON, return raw output
            resolve({ output: stdout });
          }
        }
      });

      python.on('error', (err) => {
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
   * Extract symptoms from text using the NER model
   * @param {string} text - Text to analyze
   * @returns {Promise} - Promise that resolves with extracted symptoms
   */
  async extractSymptoms(text) {
    try {
      // For now, return mock data quickly without calling Python
      // This allows the API to work without requiring Python installation
      const mockSymptoms = {
        data: [
          { symptom: 'fatigue', confidence: 0.92 },
          { symptom: 'headache', confidence: 0.78 },
          { symptom: 'insomnia', confidence: 0.85 }
        ],
        tokens: text.split(' '),
        model: 'mock-ner-model'
      };
      
      // Simulate some processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return mockSymptoms;
      
      // Uncomment below to use actual Python NER model
      /*
      const result = await this.executePythonScript(
        'api_symptom_extract.py',
        [],
        { text }
      );
      return result;
      */
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
      // For now, return mock data quickly without calling Python
      // This allows the API to work without requiring Python installation
      const mockDriftAnalysis = {
        driftScore: 0.32,
        trend: 'increasing',
        riskFactors: ['late_night_screen', 'reduced_sleep', 'stress_indicators'],
        recommendations: [
          'Reduce screen time before bed',
          'Maintain consistent sleep schedule',
          'Try meditation or relaxation techniques'
        ],
        confidence: 0.87
      };
      
      // Simulate some processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return mockDriftAnalysis;
      
      // Uncomment below to use actual Python drift analysis
      /*
      const result = await this.executePythonScript(
        'api_drift_analysis.py',
        [],
        { healthData }
      );
      return result;
      */
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
      const result = await this.executePythonScript(
        'models/symptom_graph.py',
        [],
        { symptom }
      );
      return result;
    } catch (error) {
      throw new Error(`Symptom relationship lookup failed: ${error.message}`);
    }
  }
}

module.exports = new PythonService();
