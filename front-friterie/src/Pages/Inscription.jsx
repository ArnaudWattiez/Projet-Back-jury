import React, { useState } from 'react';
import axios from 'axios';

export const Inscription = () => {
const [pseudo,setPseudo] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('') ;
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

const formData = new FormData();
formData.append('username', pseudo);
formData.append('email' , email);
formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Change content type if needed
        }
      });

      console.log('Utilisateur inscrit avec succès !', response.data);
      setMessage('Utilisateur inscrit avec succès !');
      setErreur('');
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
      setMessage('');
      setErreur('Erreur lors de l\'inscription de l\'utilisateur');
    }
  };

  return (
    <main className='min-h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="w-[28rem] border border-gray-300 rounded-lg p-8">
        {erreur && <div className="text-red-500 mb-4">{erreur}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}
        <div className="mb-4">
          <label htmlFor="Pseudo" className="text-center block text-gray-700 font-semibold">Pseudo</label>
          <input type="text" id="Pseudo" name="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-center block text-gray-700 font-semibold">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-center block text-gray-700 font-semibold">Mot de passe</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md">S'inscrire</button>
      </form>
    </main>
  );
}; 