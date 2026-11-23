const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ProductPage = require('../pages/ProductPage');

Given('I navigate to the homepage', { timeout: 120000 }, async function() {
  await this.page.goto('https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait for products API
  const response = await this.page.waitForResponse(
    response => response.url().includes('/products') && response.status() === 200,
    { timeout: 30000 }
  );
  
  const responseBody = await response.json();
  console.log('API Response:', JSON.stringify(responseBody).substring(0, 200));
  
  // Wait for network idle
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Poll for product to appear (up to 30 seconds)
  let attempts = 0;
  while (attempts < 30) {
    await this.page.waitForTimeout(1000);
    const bodyText = await this.page.locator('body').textContent();
    if (bodyText.includes('Combination')) {
      console.log(`Product found after ${attempts + 1} seconds`);
      return;
    }
    attempts++;
  }
  
  await this.page.screenshot({ path: 'debug-homepage.png', fullPage: true });
  throw new Error('Product not rendered after 30 seconds');
});

When('I click on {string} product', { timeout: 90000 }, async function(productName) {
  // Try multiple selectors
  const selectors = [
    `text=${productName}`,
    `[data-test="product-name"]:has-text("${productName}")`,
    `.card:has-text("${productName}")`,
    `a:has-text("${productName}")`
  ];
  
  let clicked = false;
  for (const selector of selectors) {
    try {
      await this.page.waitForSelector(selector, { timeout: 15000 });
      await this.page.click(selector);
      clicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${selector}`);
    }
  }
  
  if (!clicked) {
    throw new Error(`Could not find product: ${productName}`);
  }
  
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(2000);
});

Then('I should see the product name {string}', { timeout: 30000 }, async function(expectedName) {
  this.productPage = new ProductPage(this.page);
  const actualName = await this.productPage.getProductName();
  expect(actualName.trim()).to.include(expectedName);
});

Then('I should see the product price {string}', { timeout: 30000 }, async function(expectedPrice) {
  const actualPrice = await this.productPage.getProductPrice();
  expect(actualPrice.trim()).to.equal(expectedPrice);
});

Then('I should see the product description', { timeout: 30000 }, async function() {
  const description = await this.productPage.getProductDescription();
  expect(description).to.not.be.empty;
});

Then('I should see the brand name {string}', { timeout: 30000 }, async function(expectedBrand) {
  const actualBrand = await this.productPage.getBrandName();
  expect(actualBrand.trim()).to.equal(expectedBrand);
});

Then('I should see the category {string}', { timeout: 30000 }, async function(expectedCategory) {
  const actualCategory = await this.productPage.getCategoryName();
  expect(actualCategory.trim()).to.equal(expectedCategory);
});
