import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChienDetail = () => {
  // Récupération de l'ID du chien depuis les paramètres d'URL
  const { id } = useParams();

  // Déclaration des états
  const [chien, setChien] = useState(null); // État pour stocker les détails du chien
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours
  const [pseudo, setPseudo] = useState(''); // État pour stocker le pseudo de l'utilisateur
  const [nouveauCommentaireInput, setNouveauCommentaireInput] = useState(''); // État pour le champ de saisie de commentaire (pour modification)
  const [nouveauCommentaireTextarea, setNouveauCommentaireTextarea] = useState(''); // État pour le champ de texte de nouveau commentaire
  const [commentToEdit, setCommentToEdit] = useState(''); // État pour stocker l'ID du commentaire en cours d'édition

  // Effet pour charger les détails du chien
  useEffect(() => {
    setLoading(true);
    // Requête GET pour récupérer les détails du chien
    axios.get(`http://localhost:1337/api/chiens/${id}?populate=*`)
      .then((response) => {
        setChien(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des détails du chien', error);
        setLoading(false);
      });
      
    // Récupération du pseudo depuis les cookies s'il est présent
    const pseudoCookie = Cookies.get('pseudo');
    if (pseudoCookie) {
      setPseudo(pseudoCookie);
    }
  }, [id]);

  // Fonction pour supprimer un commentaire
  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/commentaires/${id}`);
      // Mise à jour de l'état des commentaires en retirant le commentaire supprimé
      setChien(prevState => ({
        ...prevState,
        attributes: {
          ...prevState.attributes,
          commentaires: {
            data: prevState.attributes.commentaires.data.filter(comment => comment.id !== id)
          }
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire', error);
    }
  };

  // Fonction pour éditer un commentaire
  const handleEditComment = async (id, contenu) => {
    try {
      await axios.put(`http://localhost:1337/api/commentaires/${id}`, {
        data: { contenu }
      });
      // Mise à jour de l'état des commentaires en modifiant le commentaire édité
      setChien(prevState => ({
        ...prevState,
        attributes: {
          ...prevState.attributes,
          commentaires: {
            data: prevState.attributes.commentaires.data.map(comment => {
              if (comment.id === id) {
                return { ...comment, attributes: { ...comment.attributes, contenu } };
              }
              return comment;
            })
          }
        }
      }));
      setCommentToEdit('');
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire', error);
    }
  };

  // Fonction pour ajouter un commentaire
  const handleAddComment = async () => {
    // Vérification si le pseudo et le commentaire sont renseignés
    if (!pseudo || !nouveauCommentaireTextarea) {
      alert('Si vous n\'êtes pas encore inscrit ou connectez vous ne pourrez pas mettre de commentaire,veuillez vous inscrire ou vous connectez.');
      return;
    }

    try {
      // Envoi de la requête pour ajouter un commentaire
      const response = await axios.post('http://localhost:1337/api/commentaires', {
        data: {
          Pseudo: pseudo,
          contenu: nouveauCommentaireTextarea,
          chien: id
        }
      });
      const newComment = response.data.data;
      // Mise à jour de l'état des commentaires en ajoutant le nouveau commentaire
      setChien(prevState => ({
        ...prevState,
        attributes: {
          ...prevState.attributes,
          commentaires: {
            data: prevState.attributes.commentaires.data.concat(newComment)
          }
        }
      }));
      setNouveauCommentaireTextarea('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
    }
  };

  // Rendu du composant ChienDetail
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="max-w-screen-md mx-auto text-center p-2 bg-white rounded shadow-lg">
          {/* Affichage des détails du chien */}
          <h1 className="text-2xl font-bold mb-4">{chien?.attributes?.Titre ?? 'Nom non disponible'}</h1>
          <div className="flex items-center gap-14 mb-8">
            <img
              src={`http://localhost:1337${chien?.attributes?.image?.data.attributes.url ?? ''}`}
              alt={chien?.attributes?.Titre ?? 'Image non disponible'}
              className="w-[300px] h-[300px] mr-2 rounded"
            />
            <div className="text-sm">
              {/* Affichage de la description du chien */}
              {chien?.attributes?.Description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* Affichage des commentaires */}
          <div className="flex justify-center items-center space-x-4">
            {chien?.attributes?.commentaires && chien?.attributes?.commentaires.data.map((commentaire) => (
              <div key={commentaire.id} className="flex items-center space-x-2 border border-gray-300 rounded p-2 mb-2">
                <p>{commentaire.attributes.Pseudo} :</p>
                {/* Affichage du commentaire à modifier ou du bouton pour le modifier */}
                {commentToEdit === commentaire.id ? (
                  <>
                    <input
                      type="text"
                      value={nouveauCommentaireInput}
                      onChange={(e) => setNouveauCommentaireInput(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={() => handleEditComment(commentaire.id, nouveauCommentaireInput)} className="text-white px-4 py-2 rounded bg-gray-800 hover:bg-gray-900">Valider</button>
                  </>
                ) : (
                  <>
                    <p>{commentaire.attributes.contenu}</p>
                    {/* Bouton pour modifier le commentaire (visible uniquement par l'auteur du commentaire) */}
                    {commentaire.attributes.Pseudo === pseudo && (
                      <button onClick={() => setCommentToEdit(commentaire.id)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded ">Modifier</button>
                    )}
                  </>
                )}
                {/* Bouton pour supprimer un commentaire (visible uniquement par l'auteur du commentaire) */}
                {commentaire.attributes.Pseudo === pseudo && (
                  <button onClick={() => handleDeleteComment(commentaire.id)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded">Supprimer</button>
                )}
              </div>
            ))}
          </div>
          {/* Formulaire pour ajouter un commentaire */}
          <form>
            <textarea
              value={nouveauCommentaireTextarea}
              onChange={(e) => setNouveauCommentaireTextarea(e.target.value)}
              placeholder="Entrez votre commentaire"
              className="w-full h-24 mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button type="button" onClick={handleAddComment} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded ">Ajouter un commentaire</button>
          </form>
        </div>
      )}
    </main>
  );
};

export default ChienDetail;



