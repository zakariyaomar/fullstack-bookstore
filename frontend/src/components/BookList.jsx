// frontend/src/components/BookList.jsx
import { useState, useEffect } from 'react';
import { fetchBooks, deleteBook } from '../api/books';


function BookList({ onBookDeleted }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  async function loadBooks() {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (categoryFilter) filters.category = categoryFilter;

      const data = await fetchBooks(filters);
      setBooks(data.books);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, [searchTerm, categoryFilter]);

  // Reload when a new book is added
  useEffect(() => {
    if (onBookDeleted) {
      loadBooks();
    }
  }, [onBookDeleted]);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await deleteBook(id);
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">All Categories</option>
          <option value="fiction">Fiction</option>
          <option value="biography">Biography</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
        </select>
      </div>

      <p>{books.length} book{books.length !== 1 ? 's' : ''} found</p>

      {books.length === 0 ? (
        <p>No books match your search.</p>
      ) : (
        <div>
          {books.map(book => (
            <div
              key={book.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{book.title}</h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  by {book.author}
                </p>
                <span style={{
                  fontSize: '0.8rem',
                  background: '#f0f0f0',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {book.category}
                </span>
                {!book.inStock && (
                  <span style={{
                    fontSize: '0.8rem',
                    background: '#ffe0e0',
                    color: '#d00',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    marginLeft: '0.5rem'
                  }}>
                    Out of Stock
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>
                  KES {book.price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(book.id)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.3rem 0.8rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;