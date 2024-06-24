// App.js
import React, { useState } from 'react';
import DiagramComponent from './DiagramComponent';
import axios from 'axios';
import './App.css';

function App() {
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.get(`http://localhost:5000/nodes/search?key=${searchKey}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error('Error searching for nodes:', error);
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
              <li><a href="#">inf 1</a></li>
              <li><a href="#">inf 2</a></li>
              <li><a href="#">inf 3</a></li>
              <li><a href="#">inf 4</a></li>
              <li><a href="#">inf 5</a></li>
            </ul>
          </aside>
        </div>
        <article className="diagrama-container">
          <DiagramComponent searchResult={searchResult} />
        </article>
      </main>
      <footer>
        <p>&copy; Copyright 2050 de nadie. Todos los derechos revertidos.</p>
      </footer>
    </div>
  );
}

export default App;
