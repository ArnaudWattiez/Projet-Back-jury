import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const Pageconnexion = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      const storedPseudo = Cookies.get('pseudo');
      if (storedPseudo) {
        setPseudo(storedPseudo);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('pseudo'); // Supprimer le pseudo du cookie lors de la déconnexion
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: pseudo,
        password: password
      });

      Cookies.set('token', response.data.jwt, { expires: 1 });
      Cookies.set('pseudo', pseudo); // Stocker le pseudo dans un cookie après connexion réussie
      setIsLoggedIn(true);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErreur('Erreur lors de la connexion');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {erreur && <div className="text-red-500 mb-4">{erreur}</div>}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Déconnexion
          </button>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pseudo">
                Pseudo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Nom d'utilisateur"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Mot de passe
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Se connecter
            </button>
          </>
        )}
      </form>
    </div>
  );
};