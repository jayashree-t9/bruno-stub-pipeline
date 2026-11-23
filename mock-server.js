const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.MOCK_SERVER_PORT || 3001;
const STUBS_DIR = path.join(__dirname, 'bruno/mocks/stubs');

const routes = {
  'GET /users/me': 'users-me.json',
  'GET /brands': 'brands.json',
  'GET /categories/tree': 'categories-tree.json',
  'GET /product-specs/names': 'product-specs-names.json',
  'GET /products': 'products/get-products-list.json',
  'QUERY /products': 'products/get-products-list.json',
  'GET /products/:id/related': 'products/get-product-related.json',
  'GET /products/:id': 'products/get-product.json',
  'POST /products': 'products/create-product.json',
  'PUT /products/:id': 'products/update-product.json',
  'DELETE /products/:id': 'products/delete-product.json',
  'GET /cart': 'cart/get-cart.json',
  'GET /carts': 'cart/get-cart.json',
  'GET /carts/:id': 'cart/get-cart.json',
  'POST /cart': 'cart/add-cart-item.json',
  'PUT /cart/:id': 'cart/update-cart-item.json',
  'DELETE /cart/:id': 'cart/remove-cart-item.json',
  'POST /carts': 'cart/add-cart-item.json',
  'POST /carts/:id': 'cart/add-cart-item.json',
  'DELETE /carts/:id': 'cart/remove-cart-item.json',
  'PUT /carts/:id/product/quantity': 'cart/update-cart-item.json',
  'DELETE /carts/:id/product/:productId': 'cart/remove-cart-item.json',
  'PUT /carts/:id/items/:itemId': 'cart/update-cart-item.json',
  'DELETE /carts/:id/items/:itemId': 'cart/remove-cart-item.json',
  'POST /orders': 'orders/place-order.json',
  'DELETE /orders/:id': 'orders/cancel-order.json'
};

function matchRoute(method, url) {
  // Remove query parameters
  const urlPath = url.split('?')[0];
  
  console.log(`Matching: ${method} ${urlPath}`);
  
  for (const [route, stubFile] of Object.entries(routes)) {
    const [routeMethod, routePath] = route.split(' ');
    if (method !== routeMethod) continue;
    
    const routeRegex = routePath.replace(/:\w+/g, '[^/]+');
    const matches = new RegExp(`^${routeRegex}$`).test(urlPath);
    console.log(`  Testing ${route} -> regex: ^${routeRegex}$ -> ${matches}`);
    
    if (matches) {
      return stubFile;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const stubFile = matchRoute(req.method, req.url);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, QUERY');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${req.method} ${req.url} -> ${stubFile || 'NOT FOUND'}`);
  
  if (stubFile) {
    const filePath = path.join(STUBS_DIR, stubFile);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Stub file not found' }));
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found', path: req.url }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
