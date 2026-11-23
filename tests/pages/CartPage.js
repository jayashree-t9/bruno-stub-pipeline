class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = 'svg[data-icon="cart-shopping"]';
    this.productTitle = '[data-test="product-title"]';
    this.cartTotal = '[data-test="cart-total"]';
    this.quantityInput = '[data-test="product-quantity"]';
    this.removeButton = '.btn-danger';
    this.emptyCartMessage = '.container';
  }

  async navigate() {
    await this.page.click(this.cartIcon);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async getProductName() {
    await this.page.waitForSelector(this.productTitle, { timeout: 30000 });
    return await this.page.locator(this.productTitle).first().textContent();
  }

  async getCartTotal() {
    await this.page.waitForSelector(this.cartTotal, { timeout: 30000 });
    return await this.page.locator(this.cartTotal).textContent();
  }

  async updateQuantity(quantity) {
    await this.page.waitForSelector(this.quantityInput, { timeout: 30000 });
    await this.page.locator(this.quantityInput).first().fill(quantity);
    await this.page.waitForTimeout(1000);
  }

  async removeProduct() {
    await this.page.waitForSelector(this.removeButton, { timeout: 30000 });
    await this.page.locator(this.removeButton).first().click();
    await this.page.waitForTimeout(1000);
  }

  async isCartEmpty() {
    const count = await this.page.locator(this.productTitle).count();
    return count === 0;
  }
}

module.exports = CartPage;
