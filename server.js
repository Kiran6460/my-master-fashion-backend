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
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware
function auth(req, res, next){
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if(parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({error:'Unauthorized'});
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e){
    return res.status(401).json({error:'Invalid token'});
  }
}

// Admin routes
app.post('/api/admin/products', auth, (req, res) => {
  const products = readProducts();
  const nextId = products.reduce((a,b)=>Math.max(a,b.id), 0) + 1;
  const newP = Object.assign({ id: nextId }, req.body);
  products.push(newP);
  writeProducts(products);
  res.json(newP);
});

app.put('/api/admin/products/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  const products = readProducts();
  const idx = products.findIndex(x=>x.id===id);
  if(idx===-1) return res.status(404).json({error:'Not found'});
  products[idx] = Object.assign(products[idx], req.body);
  writeProducts(products);
  res.json(products[idx]);
});

app.delete('/api/admin/products/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  let products = readProducts();
  products = products.filter(x=>x.id!==id);
  writeProducts(products);
  res.json({ success: true });
 
  app.get("/", (req, res) => {
  res.send("Master Fashion Backend is running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Server running on port', PORT));


