const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(__dirname, '../../reports/cucumber-report.json'),
  output: path.join(__dirname, '../../reports/cucumber-report.html'),
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
