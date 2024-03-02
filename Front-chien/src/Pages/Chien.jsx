import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ChienList = () => {
  // État pour stocker la liste des chiens et l'état de chargement
  const [chiens, setChiens] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL de l'API
  const apiUrl = 'http://localhost:1337';

  // Effet pour charger la liste des chiens depuis l'API au chargement du composant
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/chiens?populate=*`)
      .then((response) => {
        // Vérification de la réponse de l'API et mise à jour de l'état
        if (response.data && Array.isArray(response.data.data)) {
          setChiens(response.data.data);
        } else {
          console.error('Erreur: la réponse de l\'API n\'est pas un tableau', response.data);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données du carrousel', error);
      })
      .finally(() => {
        // Mise à jour de l'état de chargement une fois que la requête est terminée
        setLoading(false);
      });
  }, []);

  return (
    <main className='min-h-screen flex items-center justify-center'>
      {loading ? ( // Affichage d'un message de chargement si les données sont en cours de chargement
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {chiens.map((chien) => ( // Boucle à travers la liste des chiens et affichage de chaque chien
            <div key={chien.id} className="flex flex-col p-8 bg-white rounded shadow-md flex">                
                <div>
                  <h2 className="text-center text-lg font-semibold mb-1">{chien.attributes.Titre}</h2> {/* Affichage du titre du chien */}
                </div>
              <Link to={`/chien/${chien.id}`}> {/* Création d'un lien vers la page de détails du chien */}
                <img
                  src={`${apiUrl}${chien.attributes.image.data.attributes.url}`} /* Affichage de l'image du chien */
                  alt={chien.attributes.Titre} /* Alt pour l'accessibilité */
                  className="w-full h-auto rounded"
                  style={{ width: '100%', height: 'auto' }} 
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
