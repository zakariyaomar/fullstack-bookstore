// frontend/src/api/books.js
const API_URL = '/api';

export async function fetchBooks(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.inStock !== undefined) params.set('inStock', filters.inStock);
  if (filters.search) params.set('search', filters.search);

  const queryString = params.toString();
  const url = `${API_URL}/books${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }

  return response.json();
}

export async function fetchBook(id) {
  const response = await fetch(`${API_URL}/books/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book: ${response.status}`);
  }

  return response.json();
}

export async function createBook(bookData) {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create book');
  }

  return response.json();
}

export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete book: ${response.status}`);
  }

  return true;
}