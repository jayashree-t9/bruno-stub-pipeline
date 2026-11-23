module.exports = {
  default: {
    require: ['tests/step-definitions/**/*.js', 'tests/support/**/*.js'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    paths: ['tests/features/**/*.feature'],
    timeout: 60000
  }
};
