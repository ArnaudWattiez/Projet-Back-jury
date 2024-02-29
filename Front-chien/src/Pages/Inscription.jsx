import React, { useState } from 'react'; // Importation des hooks useState
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP

// Définition du composant Inscription
export const Inscription = () => {
  // Déclaration des états
  const [pseudo, setPseudo] = useState(''); // État pour stocker le pseudo
  const [email, setEmail] = useState(''); // État pour stocker l'email
  const [password, setPassword] = useState(''); // État pour stocker le mot de passe
  const [message, setMessage] = useState(''); // État pour stocker les messages de succès
  const [erreur, setErreur] = useState(''); // État pour stocker les messages d'erreur
  
  // Fonction de soumission du formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Création d'un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append('username', pseudo);
    formData.append('email', email);
    formData.append('password', password);

    try {
      // Envoi d'une requête POST au serveur pour l'inscription de l'utilisateur
      const response = await axios.post('http://localhost:1337/api/auth/local/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Définition du type de contenu
        }
      });

      // Affichage d'un message de succès si l'inscription est réussie
      console.log('Utilisateur inscrit avec succès !', response.data);
      setMessage('Utilisateur inscrit avec succès !');
      setErreur(''); // Efface les messages d'erreur précédents
    } catch (error) {
      // Affichage d'un message d'erreur en cas d'échec de l'inscription
      console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
      setMessage(''); // Efface les messages de succès précédents
      setErreur('Ce pseudo existe deja ou cette adresse mail existe deja');
    }
  };

  // Rendu du composant Inscription
  return (
    <main className='min-h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="w-[28rem] border border-gray-300 rounded-lg p-8">
        {erreur && <div className="text-red-500 mb-4">{erreur}</div>} {/* Affichage du message d'erreur s'il est présent */}
        {message && <div className="text-green-500 mb-4">{message}</div>} {/* Affichage du message de succès s'il est présent */}
        {/* Champ de saisie pour le pseudo */}
        <div className="mb-4">
          <label htmlFor="Pseudo" className="text-center block text-gray-700 font-semibold">Pseudo</label>
          <input type="text" id="Pseudo" name="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        {/* Champ de saisie pour l'email */}
        <div className="mb-4">
          <label htmlFor="email" className="text-center block text-gray-700 font-semibold">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        {/* Champ de saisie pour le mot de passe */}
        <div className="mb-4">
          <label htmlFor="password" className="text-center block text-gray-700 font-semibold">Mot de passe</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        {/* Bouton de soumission du formulaire */}
        <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md">S'inscrire</button>
      </form>
    </main>
  );
};
