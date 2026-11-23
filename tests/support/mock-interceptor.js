const MOCK_SERVER_URL = process.env.MOCK_SERVER_URL || 'http://localhost:3001';
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

async function enableMocking(page, mockScenario = 'default') {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    
    // Only intercept API calls to practicesoftwaretesting.com API
    if (url.includes('api.practicesoftwaretesting.com')) {
      const path = url.replace(API_BASE_URL, '');
      const mockUrl = `${MOCK_SERVER_URL}${path}`;
      
      console.log(`Intercepting: ${method} ${url}`);
      console.log(`Routing to: ${mockUrl}`);
      
      try {
        const response = await fetch(mockUrl, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const body = await response.text();
        console.log(`Mock response status: ${response.status}`);
        
        await route.fulfill({
          status: response.status,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: body
        });
      } catch (error) {
        console.error(`Mock failed for ${url}:`, error.message);
        // Continue with original request if mock fails
        await route.continue();
      }
    } else {
      // Let all other requests through
      await route.continue();
    }
  });
}

async function disableMocking(page) {
  await page.unroute('**/*');
}

module.exports = { enableMocking, disableMocking };
