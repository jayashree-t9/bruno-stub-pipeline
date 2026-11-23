const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.scenarioName = null;
    this.stepCounter = 0;
  }

  async init() {
    // Clean up old artifacts
    const artifactsDir = path.join(__dirname, '../../test-results');
    if (fs.existsSync(artifactsDir)) {
      fs.rmSync(artifactsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(artifactsDir, { recursive: true });

    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
    
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      recordVideo: {
        dir: artifactsDir,
        size: { width: 1280, height: 720 }
      }
    });
    
    await this.context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    this.page = await this.context.newPage();
  }

  async takeScreenshot(stepName) {
    this.stepCounter++;
    const screenshotDir = path.join(__dirname, '../../test-results/screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    
    const sanitizedStep = stepName.replace(/[^a-z0-9]/gi, '_');
    const filename = `step${this.stepCounter}_${sanitizedStep}.png`;
    const screenshotPath = path.join(screenshotDir, filename);
    
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async cleanup() {
    if (this.page) {
      // Save video with scenario name
      const videoPath = await this.page.video()?.path();
      if (videoPath) {
        await this.page.close();
        await this.context.close();
        
        // Rename video to scenario name
        const sanitizedName = this.scenarioName.replace(/[^a-z0-9]/gi, '_');
        const newVideoPath = path.join(path.dirname(videoPath), `${sanitizedName}.webm`);
        
        // Wait a bit for video to be written
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (fs.existsSync(videoPath)) {
          fs.renameSync(videoPath, newVideoPath);
        }
      } else {
        await this.page.close();
        await this.context.close();
      }
    }
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
