# Bruno Stub Pipeline - Playwright + Cucumber + POM Framework

Complete test automation framework integrating Bruno API mocking with Playwright, Cucumber BDD, and Page Object Model.

---

## 🏗️ Architecture

```
bruno-stub-pipeline/
├── bruno/
│   ├── collections/toolshop-api/     # Bruno API collection (imported from Swagger)
│   └── mocks/stubs/                  # JSON stub files for mock responses
│       ├── products/
│       ├── cart/
│       └── orders/
├── tests/
│   ├── features/                     # Cucumber BDD feature files
│   ├── pages/                        # Page Object Model classes
│   ├── step-definitions/             # Cucumber step definitions
│   └── support/                      # Test infrastructure
│       ├── world.js                  # Cucumber World with Playwright
│       ├── hooks.js                  # Before/After hooks
│       └── mock-interceptor.js       # API mocking layer
├── mock-server.js                    # Node.js mock server
├── playwright.config.js              # Playwright configuration
├── cucumber.config.js                # Cucumber configuration
└── package.json                      # Dependencies and scripts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v20+
- npm v11+
- Chromium browser dependencies (auto-installed)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Install system dependencies (Linux/SageMaker)
npx playwright install-deps chromium
```

---

## 📦 Dependencies

### Core Framework
- `@playwright/test` - Browser automation
- `@cucumber/cucumber` - BDD test runner
- `@usebruno/cli` - Bruno CLI tools
- `chai` - Assertion library
- `cucumber-html-reporter` - HTML report generation
- `dotenv` - Environment configuration

---

## 🎯 Key Features

### 1. **Bruno API Collection**
- Imported from Swagger/OpenAPI
- Contains all Toolshop API endpoints
- Organized by domain (Products, Cart, Orders, etc.)

### 2. **Mock Server**
- Runs on `http://localhost:3001`
- Serves stub responses from JSON files
- Supports all HTTP methods (GET, POST, PUT, DELETE)
- CORS enabled for cross-origin requests

### 3. **API Interception**
- Playwright `page.route()` intercepts API calls
- Routes requests to mock server
- Tag-based mock control (`@mock`)

### 4. **BDD with Cucumber**
- Gherkin syntax for readable scenarios
- Tag-based test execution
- Automatic screenshot on failure

### 5. **Page Object Model**
- Separation of locators and actions
- Reusable page classes
- Clean test code

---

## 🧪 Running Tests

### Start Mock Server

```bash
npm run mock:start
```

Mock server will run on `http://localhost:3001`

### Run Tests

```bash
# Run all tests
npm test

# Run specific feature
npx cucumber-js tests/features/product.feature

# Run tests with specific tag
npx cucumber-js --tags @mock
```

### Run Tests with Mock Server

```bash
npm run test:mock
```

This starts the mock server, runs tests, and stops the server.

### Generate HTML Report

```bash
npm run report
```

Report will be generated at `reports/cucumber-report.html`

---

## 📝 Writing Tests

### Feature File Example

```gherkin
@mock
Feature: Product Display

  Scenario: View product with stock available
    Given I navigate to the product page
    When I view the product details
    Then I should see the product name "Combination Pliers"
    And I should see the product price "$14.15"
    And I should see stock availability
```

### Page Object Example

```javascript
class ProductPage {
  constructor(page) {
    this.page = page;
    this.productName = '[data-test="product-name"]';
    this.productPrice = '[data-test="unit-price"]';
  }

  async navigate() {
    await this.page.goto('https://practicesoftwaretesting.com/#/product/01HHJC7RERZ0M3VDGS6X9HM33A');
  }

  async getProductName() {
    return await this.page.locator(this.productName).textContent();
  }
}
```

### Step Definition Example

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const ProductPage = require('../pages/ProductPage');

Given('I navigate to the product page', async function() {
  this.productPage = new ProductPage(this.page);
  await this.productPage.navigate();
});

Then('I should see the product name {string}', async function(expectedName) {
  const actualName = await this.productPage.getProductName();
  expect(actualName).to.include(expectedName);
});
```

---

## 🎭 Mock Server

### How It Works

1. **Mock Server** runs on port 3001
2. **Playwright** intercepts API calls to `https://api.practicesoftwaretesting.com`
3. **Requests** are routed to `http://localhost:3001`
4. **Mock Server** returns stub responses from JSON files

### Stub Files

Located in `bruno/mocks/stubs/`:

**Products:**
- `get-product.json` - Success response
- `get-product-notfound.json` - 404 error
- `create-product.json` - Product creation
- `update-product.json` - Product update
- `delete-product.json` - Product deletion

**Cart:**
- `add-cart-item.json` - Add item success
- `update-cart-item.json` - Update item
- `remove-cart-item.json` - Remove item

**Orders:**
- `place-order.json` - Order placement
- `cancel-order.json` - Order cancellation

### Adding New Stubs

1. Create JSON file in appropriate folder
2. Add route mapping in `mock-server.js`
3. Use in tests with `@mock` tag

---

## 🏷️ Cucumber Tags

### Available Tags

- `@mock` - Enable API mocking for scenario
- `@smoke` - Smoke test scenarios
- `@regression` - Regression test scenarios

### Running Tagged Tests

```bash
# Run only mock tests
npx cucumber-js --tags @mock

# Run smoke tests
npx cucumber-js --tags @smoke

# Exclude specific tags
npx cucumber-js --tags "not @wip"
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
MOCK_SERVER_PORT=3001
MOCK_SERVER_URL=http://localhost:3001
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com
```

### Playwright Config

- Browser: Chromium (headless)
- Timeout: 30 seconds
- Screenshots: On failure
- Video: On failure
- Trace: On first retry

### Cucumber Config

- Format: Progress + JSON
- Report: `reports/cucumber-report.json`
- Snippet Interface: async-await

---

## 📊 Reports

### Cucumber HTML Report

Generated at: `reports/cucumber-report.html`

Includes:
- Scenario pass/fail status
- Step execution details
- Screenshots on failure
- Execution timestamp
- Environment metadata

---

## 🛠️ Troubleshooting

### Mock Server Not Starting

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

### Browser Launch Fails

```bash
# Reinstall browser dependencies
npx playwright install-deps chromium
```

### Tests Not Found

```bash
# Verify feature files exist
ls tests/features/

# Check Cucumber config
cat cucumber.config.js
```

---

## 📚 Project Structure Details

### `/bruno/collections/toolshop-api/`
- Bruno API collection in YAML format
- Organized by API domain
- Contains request/response examples

### `/bruno/mocks/stubs/`
- JSON stub files for mock responses
- Organized by domain (products, cart, orders)
- Used by mock server

### `/tests/features/`
- Cucumber feature files (`.feature`)
- Written in Gherkin syntax
- Tagged for selective execution

### `/tests/pages/`
- Page Object Model classes
- Contains locators and UI actions
- One class per page

### `/tests/step-definitions/`
- Cucumber step implementations
- Maps Gherkin steps to code
- Uses Page Objects

### `/tests/support/`
- Test infrastructure
- Hooks, World, utilities
- Mock interceptor logic

---

## 🎓 Best Practices

### 1. **Separation of Concerns**
- POM = Locators + UI actions only
- Step Definitions = Business logic + assertions
- Hooks = Setup/teardown only

### 2. **Mock Strategy**
- Use `@mock` tag for scenarios requiring mocks
- Create specific stubs for different scenarios
- Keep stubs realistic (based on real API responses)

### 3. **Test Organization**
- One feature file per domain
- Group related scenarios
- Use descriptive scenario names

### 4. **Page Objects**
- One class per page
- Methods return data, not assertions
- Keep locators as class properties

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx playwright install-deps chromium
      - run: npx playwright install chromium
      - run: npm run test:mock
      - run: npm run report
      - uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: reports/
```

---

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Bruno Documentation](https://docs.usebruno.com)
- [Practice Software Testing](https://practicesoftwaretesting.com)

---

## 👥 Contributing

1. Create feature branch
2. Add tests for new features
3. Ensure all tests pass
4. Submit pull request

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

- Practice Software Testing for test application
- Bruno for API tooling
- Playwright team for browser automation
- Cucumber team for BDD framework
