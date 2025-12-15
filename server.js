const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Config - replace or protect in production
const ADMIN_USERNAME = "Kiran6460";
const ADMIN_PASSWORD = "Kiran@6460";
const JWT_SECRET = "replace_this_with_a_long_secret";

// Products file
const DATA_FILE = path.join(__dirname, 'products.json');

// Ensure products file exists
if(!fs.existsSync(DATA_FILE)){
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    {
      "id": 1,
      "name": "Sample T-Shirt",
      "price": 499,
      "brand": "SampleBrand",
      "image": "https://via.placeholder.com/300",
      "description": "Comfortable cotton tee."
    }
  ], null, 2));
}

// Helper read/write
function readProducts(){
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}
function writeProducts(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Public: get products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Public: get single product
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = readProducts().find(x=>x.id===id);
  if(!p) return res.status(404).json({error:'Not found'});
  res.json(p);
});

// Admin login
// login
app.post('/api/admin/login', (req, res) => {
  ...
});

// middleware
function auth(req, res, next) {
  ...
}

// admin routes
app.post('/api/admin/products', auth, (req, res) => { ... });
app.put('/api/admin/products/:id', auth, (req, res) => { ... });
app.delete('/api/admin/products/:id', auth, (req, res) => { ... });

// home test route
app.get("/", (req, res) => {
  res.send("Master Fashion Backend is running 🚀");
});

// ✅ ALWAYS LAST
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

