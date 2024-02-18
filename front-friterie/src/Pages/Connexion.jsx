import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import Cookies from 'js-cookie'; // Importation du module Cookies pour gérer les cookies

// Définition du composant Pageconnexion
export const Pageconnexion = () => {
  // Déclaration des états
  const [pseudo, setPseudo] = useState(''); // État pour stocker le pseudo
  const [password, setPassword] = useState(''); // État pour stocker le mot de passe
  const [erreur, setErreur] = useState(''); // État pour stocker les messages d'erreur
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour indiquer si l'utilisateur est connecté

  // Effet de chargement pour vérifier l'état de connexion au chargement de la page
  useEffect(() => {
    const token = Cookies.get('token'); // Récupération du token depuis les cookies
    if (token) {
      // Si un token est présent dans les cookies, l'utilisateur est connecté
      setIsLoggedIn(true); // Met à jour l'état pour indiquer que l'utilisateur est connecté
      const storedPseudo = Cookies.get('pseudo'); // Récupération du pseudo depuis les cookies
      if (storedPseudo) {
        setPseudo(storedPseudo); // Met à jour l'état avec le pseudo récupéré depuis les cookies
      }
    } else {
      setIsLoggedIn(false); // Si aucun token n'est présent, l'utilisateur n'est pas connecté
    }
  }, []); // Ce tableau vide indique que cet effet s'exécute uniquement après le premier rendu

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    try {
      // Tentative de connexion en envoyant une requête POST au serveur avec les identifiants
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: pseudo,
        password: password
      });

      // Si la connexion est réussie, stocke le token JWT dans les cookies
      Cookies.set('token', response.data.jwt, { expires: 1 }); // Le token expire après 1 jour
      Cookies.set('pseudo', pseudo); // Stocke également le pseudo dans les cookies
      setIsLoggedIn(true); // Met à jour l'état pour indiquer que l'utilisateur est connecté
      window.location.href = '/'; // Redirige l'utilisateur vers la page d'accueil
    } catch (error) {
      console.error('Erreur lors de la connexion :', error); // Affiche l'erreur dans la console
      setErreur('Erreur lors de la connexion'); // Met à jour l'état avec un message d'erreur
    }
  };

  // Rendu du composant Pageconnexion
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {erreur && <div className="text-red-500 mb-4">{erreur}</div>}
        {!isLoggedIn && ( // Vérifie si l'utilisateur n'est pas connecté avant d'afficher le formulaire de connexion
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
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Se connecter
            </button>
          </>
        )}
      </form>
    </div>
  );
};
