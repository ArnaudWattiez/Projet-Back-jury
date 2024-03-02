import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importation du module axios pour effectuer des requêtes HTTP
import Cookies from 'js-cookie'; // Importation du module js-cookie pour gérer les cookies

export const Pageconnexion = () => {
  // Déclaration des états pour gérer le pseudo, le mot de passe, les erreurs et l'état de connexion
  const [pseudo, setPseudo] = useState(''); // État pour le pseudo
  const [password, setPassword] = useState(''); // État pour le mot de passe
  const [erreur, setErreur] = useState(''); // État pour stocker les messages d'erreur
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour indiquer si l'utilisateur est connecté

  // Effet exécuté au chargement du composant pour vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = Cookies.get('token'); // Récupération du token JWT depuis les cookies
    const pseudoCookie = Cookies.get('pseudo'); // Récupération du pseudo depuis les cookies

    // Vérification de l'existence du token et du pseudo dans les cookies pour déterminer l'état de connexion
    if (token && pseudoCookie) {
      setIsLoggedIn(true); // L'utilisateur est connecté
      setPseudo(pseudoCookie); // Mise à jour du pseudo dans l'état
    } else if (token) {
      setIsLoggedIn(true); // L'utilisateur est connecté mais le pseudo n'est pas stocké dans les cookies
    } else {
      setIsLoggedIn(false); // L'utilisateur n'est pas connecté
    }
  }, []);

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    try {
      // Requête POST pour l'authentification
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: pseudo, // Pseudo de l'utilisateur
        password: password // Mot de passe de l'utilisateur
      });

      // Stockage du token JWT et du pseudo dans les cookies
      Cookies.set('token', response.data.jwt, { expires: 1 / 48 }); // Stockage du token JWT avec une expiration de 30 minutes
      Cookies.set('pseudo', pseudo); // Stockage du pseudo dans les cookies

      // Mise à jour de l'état de connexion
      setIsLoggedIn(true); // L'utilisateur est connecté

      // Redirection vers la page d'accueil
      window.location.href = '/';

    } catch (error) {
      console.error('Erreur lors de la connexion :', error); // Affichage de l'erreur dans la console
      setErreur('Erreur lors de la connexion'); // Mise à jour du message d'erreur dans l'état
    }
  };

  // Rendu du composant Pageconnexion
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Affichage du message d'erreur s'il y en a un */}
        {erreur && <div className="text-red-500 mb-4">{erreur}</div>}
        {/* Affichage du formulaire de connexion si l'utilisateur n'est pas déjà connecté */}
        {!isLoggedIn && (
          <>
            {/* Champ pour saisir le pseudo */}
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
                onChange={(e) => setPseudo(e.target.value)} // Mise à jour du pseudo lors de la saisie
              />
            </div>
            {/* Champ pour saisir le mot de passe */}
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
                onChange={(e) => setPassword(e.target.value)} // Mise à jour du mot de passe lors de la saisie
              />
            </div>
            {/* Bouton de soumission du formulaire */}
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

