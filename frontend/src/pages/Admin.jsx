import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  PieChart,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Admin.css';

const Admin = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', party: '', age: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data } = await api.get('/candidates/candidates');
      const sortedCandidates = data.candidates.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setCandidates(sortedCandidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingId) {
        await api.put(`/candidates/${editingId}`, formData);
        setMessage({ text: 'Candidate updated successfully', type: 'success' });
      } else {
        await api.post('/candidates', formData);
        setMessage({ text: 'Candidate added successfully', type: 'success' });
      }

      setFormData({ name: '', party: '', age: '' });
      setEditingId(null);
      fetchCandidates();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Operation failed';
      setMessage({
        text: errorMsg,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cand) => {
    setEditingId(cand._id);
    setFormData({ name: cand.name, party: cand.party, age: cand.age });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate forever?')) return;

    try {
      await api.delete(`/candidates/${id}`);
      fetchCandidates();
      setMessage({ text: 'Candidate removed', type: 'success' });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Delete failed';
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="admin-loader">
        <Loader2 size={50} className="spin" />
      </div>
    );
  }

  const totalVotes = candidates.reduce((a, b) => a + b.voteCount, 0);

  return (
    <div className="admin-page">

      <div className="admin-layout">

        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="admin-form-panel"
        >
          <h2>
            <Plus size={18} />
            {editingId ? 'Edit Candidate' : 'Add Candidate'}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Candidate Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Political Party"
              value={formData.party}
              onChange={(e) =>
                setFormData({ ...formData, party: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              required
            />

            {message.text && (
              <div className={`admin-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-buttons">
              <button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="spin" size={18} />
                ) : editingId ? 'Update' : 'Register'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', party: '', age: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="admin-content-panel"
        >
          <div className="admin-stats">
            <div className="stat-card">
              <Users size={22} />
              <div>
                <span>Total Candidates - </span>
                <strong>{candidates.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <PieChart size={22} />
              <div>
                <span>Total Votes - </span>
                <strong>{totalVotes}</strong>
              </div>
            </div>
          </div>

          <div className="candidate-list-header">
            <h3>Candidate Roster</h3>
            <button onClick={fetchCandidates}>
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="candidate-list">
            {candidates.map((cand) => (
              <div key={cand._id} className="candidate-item">
                <div className="candidate-info">
                  <div className="avatar">
                    {cand.name.charAt(0)}
                  </div>

                  <div>
                    <h4>{cand.name}</h4>
                    <span>{cand.party} • Age {cand.age}</span>
                  </div>
                </div>

                <div className="candidate-actions">
                  <div className="vote-count">
                    {cand.voteCount} Votes
                  </div>

                  <button onClick={() => handleEdit(cand)}>
                    <Edit size={16} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(cand._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Admin;
