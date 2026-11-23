class ProductPage {
  constructor(page) {
    this.page = page;
    this.productName = 'h1[data-test="product-name"]';
    this.productPrice = 'span[data-test="unit-price"]';
    this.productDescription = '[data-test="product-description"]';
    this.brandName = 'span[aria-label="brand"]';
    this.categoryName = 'span[aria-label="category"]';
    this.addToCartButton = '[data-test="add-to-cart"]';
    this.toastContainer = '#toast-container';
  }

  async navigate() {
    await this.page.goto('https://practicesoftwaretesting.com/#/product/01HHJC7RERZ0M3VDGS6X9HM33A');
    await this.page.waitForLoadState('domcontentloaded');
    // Wait longer for API calls
    await this.page.waitForTimeout(5000);
    // Try to wait for the element
    try {
      await this.page.waitForSelector('h1[data-test="product-name"]', { timeout: 10000 });
    } catch (e) {
      console.log('Product name element not found after waiting');
    }
  }

  async getProductName() {
    await this.page.waitForSelector(this.productName, { timeout: 10000 });
    return await this.page.locator(this.productName).textContent();
  }

  async getProductPrice() {
    await this.page.waitForSelector(this.productPrice, { timeout: 10000 });
    return await this.page.locator(this.productPrice).textContent();
  }

  async getProductDescription() {
    await this.page.waitForSelector(this.productDescription, { timeout: 10000 });
    return await this.page.locator(this.productDescription).textContent();
  }

  async getBrandName() {
    await this.page.waitForSelector(this.brandName, { timeout: 10000 });
    return await this.page.locator(this.brandName).textContent();
  }

  async getCategoryName() {
    await this.page.waitForSelector(this.categoryName, { timeout: 10000 });
    return await this.page.locator(this.categoryName).textContent();
  }

  async isAddToCartVisible() {
    return await this.page.locator(this.addToCartButton).isVisible();
  }

  async addToCart() {
    await this.page.waitForSelector(this.addToCartButton, { timeout: 30000 });
    await this.page.click(this.addToCartButton);
  }

  async getToastMessage() {
    await this.page.waitForSelector(this.toastContainer, { timeout: 5000 });
    await this.page.waitForTimeout(500);
    return await this.page.locator(this.toastContainer).textContent();
  }
}

module.exports = ProductPage;
