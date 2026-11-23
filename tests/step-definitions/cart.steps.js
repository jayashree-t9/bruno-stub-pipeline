const { When, Then } = require('@cucumber/cucumber');

const { expect } = require('chai');

const CartPage = require('../pages/CartPage');




When('I add the product to cart', async function() {
 await this.productPage.addToCart();
 await this.page.waitForTimeout(2000);
});




When('I navigate to the cart page', { timeout: 60000 }, async function() {
 this.cartPage = new CartPage(this.page);
 await this.cartPage.navigate();
});




Then('I should see {string} in the cart', { timeout: 30000 }, async function(productName) {

 const actualName = await this.cartPage.getProductName();

 expect(actualName).to.include(productName);

});




Then('I should see cart total', async function() {

 const total = await this.cartPage.getCartTotal();

 expect(total).to.match(/\$\d+\.\d{2}/);

});




When('I update the quantity to {string}', async function(quantity) {

 await this.cartPage.updateQuantity(quantity);

});




Then('I should see updated cart total', async function() {

 const total = await this.cartPage.getCartTotal();

 expect(total).to.match(/\$\d+\.\d{2}/);

});




When('I remove {string} from cart', async function(productName) {

 await this.cartPage.removeProduct();

});




Then('the cart should be empty', async function() {

 const isEmpty = await this.cartPage.isCartEmpty();

 expect(isEmpty).to.be.true;

});