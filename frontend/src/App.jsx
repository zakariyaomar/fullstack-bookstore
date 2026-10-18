// frontend/src/App.jsx
import { useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleBookAdded() {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Mctaba Bookstore</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        A full-stack React + Express bookstore application
      </p>

      <AddBookForm onBookAdded={handleBookAdded} />
      <BookList key={refreshKey} />
    </div>
  );
}

export default App;