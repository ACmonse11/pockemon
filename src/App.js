import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then(response => response.json())
      .then(async data => {
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              name: details.name,
              image: details.sprites.front_default,
              abilities: details.abilities.map(a => a.ability.name),
              stats: details.stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
              }))
            };
          })
        );
        setPokemons(pokemonDetails);
      });
  }, []);

  const handleSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closeStats = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon List</h1>
        <p className="subtitle">Select a Pokémon to see its stats</p>

        <ul className="pokemon-list">
          {pokemons.map((pokemon, index) => (
            <li
              key={index}
              className="pokemon-card"
              onClick={() => handleSelect(pokemon)}
            >
              <img
                className="pokemon-sprite"
                src={pokemon.image}
                alt={pokemon.name}
              />
              <div className="pokemon-name">{pokemon.name}</div>

              <ul className="pokemon-abilities">
                {pokemon.abilities.map((ability, i) => (
                  <li key={i} className="pokemon-ability">
                    🌀 {ability}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </header>

      {selectedPokemon && (
        <div className="pokemon-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeStats}>×</button>
            <h2 className="stat-title">
              {selectedPokemon.name.toUpperCase()}
            </h2>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="stat-image"
            />
            <h3>Estadísticas base</h3>
            <ul className="stats-list">
              {selectedPokemon.stats.map((stat, i) => (
                <li key={i} className={`stat-item stat-${stat.name}`}>
                  <span className="stat-name">{formatStatName(stat.name)}:</span>
                  <span className="stat-value">{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function formatStatName(name) {
  const map = {
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidad',
    hp: 'HP'
  };
  return map[name] || name;
}

export default App;
