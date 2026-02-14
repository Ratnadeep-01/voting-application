import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Vote, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './Candidates.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [candRes, profileRes] = await Promise.all([
        api.get('/candidates/candidates'),
        api.get('/users/profile')
      ]);

      setCandidates(candRes.data.candidates);
      setUserProfile(profileRes.data.user);
    } catch {
      setMessage({ text: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candId) => {
    setVoteLoading(candId);
    setMessage({ text: '', type: '' });

    try {
      await api.post(`/candidates/vote/${candId}`);
      setMessage({ text: 'Vote cast successfully!', type: 'success' });
      fetchInitialData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Voting failed',
        type: 'error'
      });
    } finally {
      setVoteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="candidates-loader">
        <Loader2 size={50} className="spin" />
      </div>
    );
  }

  const totalVotes =
    candidates.reduce((a, b) => a + b.voteCount, 0) || 1;

  return (
    <div className="candidates-page">
      <header className="candidates-header">
        <h1 className="gradient-text">Secure Voting Portal</h1>
        <p>Exercise your right to vote. Select your preferred candidate.</p>

        {userProfile?.isVoted && (
          <div className="voted-badge">
            <CheckCircle size={18} />
            You have already voted
          </div>
        )}
      </header>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message.text}
        </div>
      )}

      <div className="candidates-grid">
        {candidates.map((candidate, idx) => {
          const percent =
            (candidate.voteCount / totalVotes) * 100;

          return (
            <motion.div
              key={candidate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="candidate-card"
            >
              <div className="card-top">
                <div className="icon-box">
                  <Users size={26} />
                </div>
                <span className="candidate-id">
                  ID: {candidate._id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h3>{candidate.name}</h3>
              <p className="party">{candidate.party}</p>

              <div className="vote-progress">
                <div className="progress-label">
                  <span>{candidate.voteCount} Votes</span>
                </div>
                <div className="progress-bar">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleVote(candidate._id)}
                disabled={
                  userProfile?.isVoted ||
                  user.role === 'admin' ||
                  voteLoading === candidate._id
                }
                className={`vote-btn ${
                  userProfile?.isVoted ? 'disabled' : ''
                }`}
              >
                {voteLoading === candidate._id ? (
                  <Loader2 className="spin" size={18} />
                ) : (
                  <>
                    <Vote size={16} />
                    {userProfile?.isVoted
                      ? 'Vote Cast'
                      : 'Confirm Vote'}
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Candidates;
