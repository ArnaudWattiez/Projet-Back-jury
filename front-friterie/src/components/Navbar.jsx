import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo_de_chien from './images/logo_de_chien.png'; // Importez le logo de chien depuis votre dossier d'images
import Cookies from 'js-cookie';

const Navbar = () => {
  // État pour indiquer si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprimer le cookie d'authentification
    Cookies.remove('authToken');
    // Mettre à jour l'état de connexion
    setIsLoggedIn(false);
  };

  // useEffect pour vérifier l'état de connexion au chargement
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Rendu du composant
  return (
    <header>
      {/* Barre de navigation avec titre et boutons de connexion/déconnexion et d'inscription */}
      <nav className="flex items-center justify-between py-4 px-6 bg-[#0c1017] text-white">
        {/* Logo de chien */}
        <Link to="/">
          <img src={logo_de_chien} alt="Logo_de_chien" className="h-20 w-auto" />
        </Link>

        {/* Titre de la barre de navigation */}
        <h1 className="text-xl font-semibold">Les races de Chiens</h1>

        {/* Boutons de connexion/déconnexion et d'inscription */}
        <div className="flex items-center">
          {/* Bouton de connexion/déconnexion */}
          {isLoggedIn ? (
            // Si l'utilisateur est connecté, afficher le bouton de déconnexion
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 hover:bg-gray-900 rounded-md text-white">
              Déconnexion
            </button>
          ) : (
            // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion
            <Link to="/Connexion" className="px-4 py-2 bg-gray-800 hover:bg-gray-900 rounded-md text-white mr-4">
              Connexion
            </Link>
          )}

          {/* Bouton d'inscription */}
          <Link to="/Inscription" className="px-4 py-2 bg-gray-800 hover:bg-gray-900 rounded-md text-white">
            Inscription
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
