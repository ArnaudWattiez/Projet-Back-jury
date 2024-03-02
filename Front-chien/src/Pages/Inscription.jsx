import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importation du module axios pour effectuer des requêtes HTTP
import Cookies from 'js-cookie'; // Importation du module js-cookie pour gérer les cookies

export const Inscription = () => {
  // Déclaration des états pour les champs du formulaire et les messages
  const [pseudo, setPseudo] = useState(''); // État pour le pseudo
  const [email, setEmail] = useState(''); // État pour l'email
  const [password, setPassword] = useState(''); // État pour le mot de passe
  const [message, setMessage] = useState(''); // État pour le message de succès ou d'erreur
  const [erreur, setErreur] = useState(''); // État pour le message d'erreur
  const [passwordStrength, setPasswordStrength] = useState(''); // État pour la force du mot de passe
  const [allFieldsFilled, setAllFieldsFilled] = useState(false); // État pour indiquer si tous les champs sont remplis
  const [showCookieMessage, setShowCookieMessage] = useState(true); // État pour afficher le message sur les cookies

  // Effet pour vérifier si l'utilisateur a accepté les cookies
  useEffect(() => {
    if (Cookies.get('cookie_consent')) { // Vérification de l'acceptation des cookies
      setShowCookieMessage(false); // Masquage du message sur les cookies
    }
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    // Validation de l'adresse email
    if (!validateEmail(email)) { // Vérification de la validité de l'adresse email
      setErreur('Adresse email invalide'); // Affichage d'un message d'erreur
      return; // Arrêt de la fonction
    }

    // Vérification que tous les champs sont remplis
    if (!pseudo || !email || !password) { // Vérification si un champ est vide
      setErreur('Veuillez remplir tous les champs.'); // Affichage d'un message d'erreur
      return; // Arrêt de la fonction
    }

    // Création des données du formulaire
    const formData = new FormData(); // Création d'un objet FormData pour envoyer les données
    formData.append('username', pseudo); // Ajout du pseudo au formulaire
    formData.append('email', email); // Ajout de l'email au formulaire
    formData.append('password', password); // Ajout du mot de passe au formulaire

    try {
      // Envoi de la requête pour l'inscription de l'utilisateur
      const response = await axios.post('http://localhost:1337/api/auth/local/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Spécification du type de contenu
        }
      });

      // Affichage du message de succès
      setMessage('Utilisateur inscrit avec succès !');
      setErreur(''); // Réinitialisation du message d'erreur

      // Définition du cookie pour indiquer que l'utilisateur a accepté les cookies
      Cookies.set('cookie_consent', 'true', { expires: 1 / 48, path: '/' }); // Stockage du cookie avec expiration après 30 minutes

      setShowCookieMessage(false); // Masquage du message sur les cookies

    } catch (error) {
      // Affichage du message d'erreur en cas d'échec de l'inscription
      console.error('Erreur lors de l\'inscription de l\'utilisateur :', error); // Affichage de l'erreur dans la console
      setMessage(''); // Réinitialisation du message de succès
      setErreur('Ce pseudo existe déjà ou cette adresse email existe déjà'); // Affichage du message d'erreur
    }
  };

  // Validation de l'adresse email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour valider l'adresse email
    return emailRegex.test(email); // Vérification de la correspondance avec l'expression régulière
  };

  // Validation de la force du mot de passe
  const validatePasswordStrength = (password) => {
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}$/; // Expression régulière pour un mot de passe fort
    const mediumPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/; // Expression régulière pour un mot de passe moyen
    if (strongPasswordRegex.test(password)) { // Vérification si le mot de passe correspond à un mot de passe fort
      return 'Fort'; 
        } else if (mediumPasswordRegex.test(password)) { // Vérification si le mot de passe correspond à un mot de passe moyen
      return 'Moyen'; 
    } else {
      return 'Faible'; 
    }
  };

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = () => {
    setAllFieldsFilled(pseudo && email && password); // Vérification si tous les champs sont remplis
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value; // Récupération du nouveau mot de passe
    const strength = validatePasswordStrength(newPassword); // Validation de la force du mot de passe
    setPasswordStrength(strength); // Mise à jour de la force du mot de passe
    setPassword(newPassword); // Mise à jour du mot de passe
  };

  // Rendu du composant Inscription
  return (
    <main className='min-h-screen flex flex-col items-center justify-center'>
      {/* Affichage du message sur les cookies */}
      {showCookieMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-200">
          <div className="flex flex-col items-center">
            <p>Ce site utilise des cookies pour vous offrir la meilleure expérience possible. Acceptez-vous les cookies ?</p>
            <div className="flex mt-4">
              {/* Bouton pour accepter les cookies */}
              <button onClick={() => { setShowCookieMessage(false); Cookies.set('cookie_navigation_decision', 'true', { expires: 1 / 48, path: '/' }); }} className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md mr-2">Accepter les cookies</button>
              {/* Bouton pour refuser les cookies */}
              <button onClick={() => window.location.href = '/'} className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md">Refuser les cookies</button>
            </div>
          </div>
        </div>
      )}
      {/* Affichage du formulaire d'inscription */}
      {!showCookieMessage && (
        <form onSubmit={handleSubmit} className="w-[28rem] border border-gray-300 rounded-lg p-8">
          {/* Affichage du message d'erreur */}
          {erreur && <div className="text-gray-700 mb-4">{erreur}</div>}
          {/* Affichage du message de succès */}
          {message && <div className="text-gray-700 mb-4">{message}</div>}
          {/* Champ Pseudo */}
          <div className="mb-4">
            <label htmlFor="Pseudo" className="text-center block text-gray-700 font-semibold">Pseudo</label>
            <input type="text" id="Pseudo" name="Pseudo" value={pseudo} onChange={(e) => { setPseudo(e.target.value); handleInputChange(); }} placeholder="Entrez votre pseudo" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          {/* Champ Email */}
          <div className="mb-4">
            <label htmlFor="email" className="text-center block text-gray-700 font-semibold">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); handleInputChange(); }} placeholder="Entrez votre adresse email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          {/* Champ Mot de passe */}
          <div className="mb-4">
            <label htmlFor="password" className="text-center block text-gray-700 font-semibold">Mot de passe</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => { handlePasswordChange(e); handleInputChange(); }} placeholder="Entrez votre mot de passe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            {/* Affichage de la force du mot de passe */}
            {password && (
              <div className="text-gray-700 mt-1">
                Puissance du mot de passe : {passwordStrength}
              </div>
            )}
          </div>
          {/* Bouton S'inscrire */}
          <button type="submit" disabled={!allFieldsFilled} className={`w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md ${!allFieldsFilled && 'opacity-50 cursor-not-allowed'}`}>S'inscrire</button>
        </form>
      )}
    </main>
  );
};
