const { Before, After, BeforeAll, AfterAll, AfterStep } = require('@cucumber/cucumber');
const { enableMocking, disableMocking } = require('./mock-interceptor');

BeforeAll(async function() {
  console.log('Starting test suite...');
});

Before(async function(scenario) {
  this.scenarioName = scenario.pickle.name;
  this.stepCounter = 0;
  await this.init();
  
  const tags = scenario.pickle.tags.map(tag => tag.name);
  const useMock = tags.includes('@mock');
  
  if (useMock) {
    await enableMocking(this.page);
    console.log(`Mock enabled for scenario: ${scenario.pickle.name}`);
  }
});

AfterStep(async function({ pickle, pickleStep, result }) {
  // Take screenshot after each step
  const stepName = pickleStep.text;
  await this.takeScreenshot(stepName);
});

After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
  
  await disableMocking(this.page);
  await this.cleanup();
});

AfterAll(async function() {
  console.log('Test suite completed.');
});
