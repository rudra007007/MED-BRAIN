#!/usr/bin/env node

/**
 * Quick test script to verify backend and AI integration
 * Run: node test-integration.js
 */

const symptomService = require('./services/python.service');

console.log('🧪 Testing MED-BRAIN Backend Integration\n');

async function testSymptomExtraction() {
  console.log('1️⃣  Testing Symptom Extraction...');
  try {
    const result = await symptomService.extractSymptoms(
      "I have been experiencing severe headaches and dizziness for the past three days"
    );
    
    if (result.success) {
      console.log('✅ Symptom Extraction: SUCCESS');
      console.log('   Extracted symptoms:', result.data);
    } else {
      console.log('❌ Symptom Extraction: FAILED');
      console.log('   Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Symptom Extraction: ERROR');
    console.log('   ', error.message);
  }
  console.log('');
}

async function testDriftAnalysis() {
  console.log('2️⃣  Testing Drift Analysis...');
  try {
    const healthData = [
      { date: '2026-01-01', steps: 10000, sleep_hours: 8.0 },
      { date: '2026-01-02', steps: 9500, sleep_hours: 7.8 },
      { date: '2026-01-03', steps: 9800, sleep_hours: 7.9 },
      { date: '2026-01-04', steps: 10200, sleep_hours: 8.1 },
      { date: '2026-01-05', steps: 9900, sleep_hours: 7.7 },
      { date: '2026-01-06', steps: 8500, sleep_hours: 6.5 },
      { date: '2026-01-07', steps: 7000, sleep_hours: 5.5 },
      { date: '2026-01-08', steps: 6500, sleep_hours: 5.0 },
      { date: '2026-01-09', steps: 6000, sleep_hours: 4.8 },
      { date: '2026-01-10', steps: 5800, sleep_hours: 4.5 },
    ];

    const result = await symptomService.analyzeDrift(healthData);
    
    if (result.success) {
      console.log('✅ Drift Analysis: SUCCESS');
      console.log('   Explanations:', result.data.explanations);
      console.log('   Metrics:', result.data.metrics);
    } else {
      console.log('❌ Drift Analysis: FAILED');
      console.log('   Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Drift Analysis: ERROR');
    console.log('   ', error.message);
  }
  console.log('');
}

async function runTests() {
  console.log('Prerequisites:');
  console.log('- Python installed');
  console.log('- Required packages: pip install transformers pandas torch');
  console.log('- Engine directory accessible\n');
  console.log('─'.repeat(60));
  console.log('');

  await testSymptomExtraction();
  await testDriftAnalysis();

  console.log('─'.repeat(60));
  console.log('\n✨ Integration test complete!\n');
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
