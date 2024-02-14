import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChienDetail = () => {
  const { id } = useParams();
  const [chien, setChien] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [commentaires, setCommentaires] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:1337/api/chiens/${id}?populate=*`)
      .then((response) => {
        setChien(response.data.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des détails du chien', error);
      });

    // Récupérer le pseudo à partir du cookie
    const pseudoCookie = Cookies.get('pseudo');
    if (pseudoCookie) {
      setPseudo(pseudoCookie);
    }
  }, [id]);

  const handleDeleteComment = (id) => {
    axios.delete(`http://localhost:1337/api/commentaires/${id}`)
      .then(() => {
        console.log('Le commentaire a été supprimé avec succès');
        // Mettre à jour les commentaires après la suppression
      })
      .then(() => {
        console.log('Le commentaire a été ajouté avec succès');
        // Rechargez la page après l'ajout du commentaire
        window.location.reload();
    })
      .catch((error) => {
        console.error('Erreur lors de la suppression du commentaire', error);
      });
  };

  const handleEditComment = (id, nouveauContenu) => {
    axios.put(`http://localhost:1337/api/commentaire/${id}`)
      .then(() => {
        console.log('Le commentaire a été modifié avec succès');
        // Mettre à jour les commentaires après la modification si nécessaire
        // Vous pouvez éventuellement utiliser setCommentaires pour mettre à jour l'état des commentaires
      })
      .catch((error) => {
        console.error('Erreur lors de la modification du commentaire', error);
      });
  };
  const handleAddComment = () => {
    // Vérifiez si le pseudo et le nouveau commentaire sont renseignés
    if (!pseudo || !nouveauCommentaire) {
      alert('Veuillez remplir tous les champs pour ajouter un commentaire.');
      return;
    }

    // Données du nouveau commentaire à envoyer au serveur
    // Envoi de la requête POST pour ajouter le commentaire
    axios.post('http://localhost:1337/api/commentaires', {
        data: {
            Pseudo: pseudo,
            contenu: nouveauCommentaire, // Utilisez le contenu du nouveau commentaire saisi par l'utilisateur
            chien: id
        }
    })
    .then(() => {
        console.log('Le commentaire a été ajouté avec succès');
        // Rechargez la page après l'ajout du commentaire
        window.location.reload();
    })
    .catch((error) => {
        console.error('Erreur lors de l\'ajout du commentaire', error);
    });
};
// console.log(commentaires)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="max-w-screen-md mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">{chien.attributes?.Titre ?? 'Nom non disponible'}</h1>
          <img
            src={`http://localhost:1337${chien.attributes?.image?.data.attributes.url ?? ''}`}
            alt={chien.attributes?.Titre ?? 'Image non disponible'}
            className="w-[28rem] max-w-full h-auto mb-4"
          />
          <p className="text-lg mb-4">{chien.attributes?.Description ?? 'Description non disponible'}</p>
          <div className="flex justify-center items-center space-x-4">
          {chien.attributes?.commentaires && chien.attributes?.commentaires.data.map((commentaire) => (
              <div key={commentaire.id} className="flex items-center space-x-2">
                <p>{commentaire.attributes.Pseudo}</p>
                <p>{commentaire.attributes.contenu}</p>
                <button onClick={() => handleDeleteComment(commentaire.id)}>Supprimer</button>
                <button onClick={() => handleEditComment(commentaire.id, 'Nouveau contenu')}>Modifier</button>
              </div>
))}
          </div>
          <form>
    <input
        type="text"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Entrez votre pseudo"
        className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    />
    <textarea
        value={nouveauCommentaire}
        onChange={(e) => setNouveauCommentaire(e.target.value)}
        placeholder="Entrez votre commentaire"
        className="w-full h-24 mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    />
    <button type="button" onClick={handleAddComment} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter un commentaire</button>
</form>
        </div>
      )}
    </main>
  );
};

export default ChienDetail