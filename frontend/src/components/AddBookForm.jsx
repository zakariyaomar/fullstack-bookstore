// frontend/src/components/AddBookForm.jsx
import { useState } from 'react';
import { createBook } from '../api/books';

function AddBookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: 'fiction'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const bookData = {
        ...formData,
        price: Number(formData.price)
      };

      await createBook(bookData);
      setSuccess(true);
      setFormData({ title: '', author: '', price: '', category: 'fiction' });

      if (onBookAdded) onBookAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Add a New Book</h2>

      {error && (
        <p style={{ color: 'red', background: '#ffe0e0', padding: '0.5rem', borderRadius: '4px' }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: 'green', background: '#e0ffe0', padding: '0.5rem', borderRadius: '4px' }}>
          Book added successfully!
        </p>
      )}

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '500px' }}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price in KES"
          value={formData.price}
          onChange={handleChange}
          required
          min="1"
          style={{ padding: '0.5rem' }}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ padding: '0.5rem' }}
        >
          <option value="fiction">Fiction</option>
          <option value="biography">Biography</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="history">History</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.75rem',
            background: submitting ? '#999' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {submitting ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}

export default AddBookForm;