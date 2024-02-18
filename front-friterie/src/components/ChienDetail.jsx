import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChienDetail = () => {
  const { id } = useParams();
  const [chien, setChien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pseudo, setPseudo] = useState('');
  const [nouveauCommentaireInput, setNouveauCommentaireInput] = useState('');
  const [nouveauCommentaireTextarea, setNouveauCommentaireTextarea] = useState('');
  const [commentToEdit, setCommentToEdit] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:1337/api/chiens/${id}?populate=*`)
      .then((response) => {
        setChien(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des détails du chien', error);
        setLoading(false);
      });
      
    const pseudoCookie = Cookies.get('pseudo');
    if (pseudoCookie) {
      setPseudo(pseudoCookie);
    }
  }, [id]);

  const handleDeleteComment = (id) => {
    axios.delete(`http://localhost:1337/api/commentaires/${id}`)
      .then(() => {
        console.log('Le commentaire a été supprimé avec succès');
        setChien(prevState => {
          const updatedComments = prevState.attributes.commentaires.data.filter(comment => comment.id !== id);
          return { ...prevState, attributes: { ...prevState.attributes, commentaires: { data: updatedComments } } };
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du commentaire', error);
      });
  };

  const handleEditComment = (id, contenu) => {
    axios.put(`http://localhost:1337/api/commentaires/${id}`, {
      data: {
        contenu: contenu,
      }
    })
      .then(() => {
        console.log('Le commentaire a été modifié avec succès');
        setChien(prevState => {
          const updatedComments = prevState.attributes.commentaires.data.map(comment => {
            if (comment.id === id) {
              return { ...comment, attributes: { ...comment.attributes, contenu: contenu } };
            }
            return comment;
          });
          return { ...prevState, attributes: { ...prevState.attributes, commentaires: { data: updatedComments } } };
        });
        setCommentToEdit('');
      })
      .catch((error) => {
        console.error('Erreur lors de la modification du commentaire', error);
      });
  };

  const handleAddComment = () => {
    if (!pseudo || !nouveauCommentaireTextarea) {
      alert('Si vous n\'êtes pas encore inscrit ou connectez vous ne pourrez pas mettre de commentaire, veuillez vous inscrire ou vous connectez.');
      return;
    }

    axios.post('http://localhost:1337/api/commentaires', {
      data: {
        Pseudo: pseudo,
        contenu: nouveauCommentaireTextarea,
        chien: id
      }
    })
      .then((response) => {
        console.log('Le commentaire a été ajouté avec succès');
        const newComment = response.data.data;
        setChien(prevState => {
          const updatedComments = prevState.attributes.commentaires.data.concat(newComment);
          return { ...prevState, attributes: { ...prevState.attributes, commentaires: { data: updatedComments } } };
        });
        setNouveauCommentaireTextarea('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du commentaire', error);
      });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="max-w-screen-md mx-auto text-center p-2 bg-white rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{chien?.attributes?.Titre ?? 'Nom non disponible'}</h1>
          <div className="flex items-center gap-14 mb-8">
            <img
              src={`http://localhost:1337${chien?.attributes?.image?.data.attributes.url ?? ''}`}
              alt={chien?.attributes?.Titre ?? 'Image non disponible'}
              className="w-[300px] h-[300px] mr-2 rounded"
            />
            <div className="text-sm"> {/* Changement de la taille du texte */}
              {chien?.attributes?.Description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4">
          {chien?.attributes?.commentaires && chien?.attributes?.commentaires.data.map((commentaire) => (
  <div key={commentaire.id} className="flex items-center space-x-2 border border-gray-300 rounded p-2 mb-2">
    <p>{commentaire.attributes.Pseudo} :</p> {/* Ajout de ":" après le pseudo */}
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
        {commentaire.attributes.Pseudo === pseudo && (
          <button onClick={() => setCommentToEdit(commentaire.id)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded ">Modifier</button>
        )}
      </>
    )}
    {commentaire.attributes.Pseudo === pseudo && (
      <button onClick={() => handleDeleteComment(commentaire.id)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded">Supprimer</button>
    )}
  </div>
))}

          </div>
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

