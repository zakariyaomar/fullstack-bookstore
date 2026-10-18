// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(morgan('dev'));
app.use(express.json());

// In-memory data store
let books = [
  {
    id: 1,
    title: 'Weep Not, Child',
    author: 'Ngugi wa Thiong\'o',
    price: 1200,
    category: 'fiction',
    inStock: true
  },
  {
    id: 2,
    title: 'Dust',
    author: 'Yvonne Adhiambo Owuor',
    price: 1800,
    category: 'fiction',
    inStock: true
  },
  {
    id: 3,
    title: 'Born a Crime',
    author: 'Trevor Noah',
    price: 1500,
    category: 'biography',
    inStock: false
  },
  {
    id: 4,
    title: 'The River Between',
    author: 'Ngugi wa Thiong\'o',
    price: 1100,
    category: 'fiction',
    inStock: true
  },
  {
    id: 5,
    title: 'I Do Not Come to You by Chance',
    author: 'Adaobi Tricia Nwaubani',
    price: 1350,
    category: 'fiction',
    inStock: true
  }
];

let nextId = 6;

// GET all books
app.get('/api/books', (req, res) => {
  let results = [...books];

  if (req.query.category) {
    results = results.filter(b => b.category === req.query.category);
  }

  if (req.query.inStock !== undefined) {
    results = results.filter(b => b.inStock === (req.query.inStock === 'true'));
  }

  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    results = results.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term)
    );
  }

  res.json({ count: results.length, books: results });
});

// GET single book
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST new book
app.post('/api/books', (req, res) => {
  const { title, author, price, category } = req.body;

  if (!title || !author || !price || !category) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'title, author, price, and category are required'
    });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    price,
    category,
    inStock: true
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});