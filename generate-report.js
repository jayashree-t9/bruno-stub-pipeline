const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const jsonFile = path.join(reportsDir, 'cucumber-report.json');

// Check if JSON file exists
if (!fs.existsSync(jsonFile)) {
  console.error('No test results found. Tests may have failed to run.');
  process.exit(1);
}

const options = {
  theme: 'bootstrap',
  jsonFile: jsonFile,
  output: path.join(reportsDir, 'cucumber-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Name': 'Practice Software Testing - Toolshop',
    'Test Environment': 'Mock Server',
    'Browser': 'Chromium',
    'Platform': 'Linux',
    'Executed': new Date().toISOString()
  }
};

reporter.generate(options);
console.log('HTML report generated at:', options.output);
