import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trophy, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import './Votecount.css';

const VoteCount = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/candidates/vote/count');
      setResults(data.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vote-loader">
        <Loader2 size={50} className="spin" />
      </div>
    );
  }

  const totalVotes = results.reduce((a, b) => a + b.voteCount, 0) || 1;

  return (
    <div className="vote-page">
      <header className="vote-header">
        <div>
          <h1 className="gradient-text">Election Results</h1>
          <p className="subtitle">Current standings based on verified votes</p>
        </div>

        <button onClick={fetchResults} className="refresh-btn">
          <RefreshCw size={22} />
        </button>
      </header>

      <div className="vote-list">
        {results.map((cand, idx) => {
          const percent = (cand.voteCount / totalVotes) * 100;

          return (
            <motion.div
              key={cand.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`vote-card ${idx === 0 ? 'winner' : ''}`}
            >
              <div className="candidate-left">
                <div className={`rank-box ${idx === 0 ? 'rank-winner' : ''}`}>
                  {idx === 0 ? <Trophy size={22} /> : idx + 1}
                </div>

                <div>
                  <h3>{cand.name}</h3>
                  <span>Verified Candidate</span>
                </div>
              </div>

              <div className="candidate-right">
                <div className="vote-count">
                  <TrendingUp size={16} />
                  <strong>{cand.voteCount}</strong>
                </div>

                <div className="progress-bar">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VoteCount;
