const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ProductPage = require('../pages/ProductPage');

Given('I navigate to the homepage', { timeout: 60000 }, async function() {
  await this.page.goto('https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await this.page.waitForTimeout(5000);
});

When('I click on {string} product', { timeout: 90000 }, async function(productName) {
  await this.page.waitForSelector(`text=${productName}`, { timeout: 60000 });
  await this.page.click(`text=${productName}`);
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
