
// src/App.js
import React, { useState } from 'react';
import DiagramComponent from './DiagramComponent';
import './App.css';
import axios from 'axios';

function App() {
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/nodes/search', {
        params: { key: searchKey }
      });
      setSearchResult(response.data);
    } catch (error) {
      console.error('Error fetching node:', error);
      setSearchResult(null);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Topologías de red Claro</h1>
      </header>
      <main className="Contenedor">
        <div className="barra-lateral">
          <nav>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                id="buscador" 
                placeholder="Buscar" 
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button className="button-buscar" type="submit">Buscar</button>

            </form>
          </nav>
          <aside>
            <h2>Relacionado</h2>
            <ul>
              <li><a href="#">Usuario</a></li>
              <li><a href="#">inf 1</a></li>
            </ul>
          </aside>
        </div>
        <article className="diagrama-container">
          <DiagramComponent searchResult={searchResult} />

        </article>
      </main>
      <footer>
        <p>&copy; Claro Colombia

        </p>|
      </footer>
    </div>
  );
}

export default App;
