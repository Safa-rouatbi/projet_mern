import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Header from "../components/Header";

export default function Reviews() {
  const { providerId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [formData, setFormData] = useState({
    provider: providerId || "",
    rating: 5,
    comment: ""
  });

  const [editFormData, setEditFormData] = useState({
    rating: 5,
    comment: ""
  });

  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (providerId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/provider/${providerId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Erreur fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/reviews", formData);
      alert("Avis créé");
      setShowForm(false);
      setFormData({ provider: providerId || "", rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditFormData({
      rating: review.rating,
      comment: review.comment || ""
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.put(`/reviews/${editingReviewId}`, editFormData);
      alert("Avis modifié");
      setEditingReviewId(null);
      setEditFormData({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      alert("Avis supprimé");
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">Chargement...</div>
      </div>
    );
  }

  // Vérifier si l'utilisateur a déjà laissé un avis pour ce provider
  const userReview = reviews.find(
    (review) => user?.id && review.client?._id && String(user.id) === String(review.client._id)
  );
  const canCreateReview = user?.role === "client" && providerId && !showForm && !userReview;

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Avis</h2>

        {canCreateReview && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Laisser un avis
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="form-card">
            <h3>Nouvel avis</h3>

            <label>
              Note (1-5):
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                required
              />
            </label>

            <textarea
              placeholder="Commentaire (optionnel)"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Envoyer
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    provider: providerId || "",
                    rating: 5,
                    comment: ""
                  });
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="empty-state">Aucun avis</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => {
              // Comparer les IDs en string pour éviter les problèmes de type
              const isOwner = user?.id && review.client?._id && String(user.id) === String(review.client._id);
              const isEditing = editingReviewId === review._id;

              return (
                <div key={review._id} className="review-card">
                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="form-card">
                      <h3>Modifier l'avis</h3>

                      <label>
                        Note (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={editFormData.rating}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              rating: parseInt(e.target.value)
                            })
                          }
                          required
                        />
                      </label>

                      <textarea
                        placeholder="Commentaire (optionnel)"
                        value={editFormData.comment}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            comment: e.target.value
                          })
                        }
                      />

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setEditingReviewId(null);
                            setEditFormData({ rating: 5, comment: "" });
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="review-header">
                        <strong>{review.client?.name || "Anonyme"}</strong>
                        <span className="rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      {review.comment && <p>{review.comment}</p>}
                      <small>
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </small>
                      {isOwner && user?.role === "client" && (
                        <div className="card-actions">
                          <button
                            className="btn-primary"
                            onClick={() => handleEdit(review)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(review._id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

