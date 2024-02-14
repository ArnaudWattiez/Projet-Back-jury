import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ChienList = () => {
  const [chiens, setChiens] = useState();
  const [loading, setLoading] = useState(true);

  const apiUrl = 'http://localhost:1337';

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/chiens?populate=*`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setChiens(response.data.data);
        } else {
          console.error('Erreur: la réponse de l\'API n\'est pas un tableau', response.data);
          setChiens([]);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données du carrousel', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className='min-h-screen flex items-center justify-center'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {chiens.map((chien) => (
            <div key={chien.id} className="flex flex-col p-8 bg-white rounded shadow-md flex">                
                <div>
                  <h2 className=" text-center text-lg font-semibold mb-1">{chien.attributes.Titre}</h2>
                </div>
              <Link to={`/chien/${chien.id}`} className="">
                <img
                  src={`${apiUrl}${chien.attributes.image.data.attributes.url}`}
                  alt={chien.attributes.Titre}
                  className="w-full h-auto rounded"
                  style={{ width: '100%', height: 'auto' }} // Ajuste la taille de l'image en fonction de sa largeur
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};