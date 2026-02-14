import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Vote, Shield, BarChart3, Users, ChevronRight, Zap, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const features = [
    { icon: <Shield className="text-primary" />, title: "Secure Voting", desc: "Military-grade encryption for every cast vote." },
    { icon: <Zap className="text-secondary" />, title: "Instant Results", desc: "Real-time verification and tallying of all polls." },
    { icon: <Users className="text-accent" />, title: "Transparent", desc: "Auditable and clear voting processes for everyone." }
  ];

  return (
    <div className="landing-wrapper">
      <motion.section
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            Next-Gen Voting Platform
          </div>
          <h1 className="hero-title">
            The Future of <br />
            <span className="gradient-text">Digital Democracy</span>
          </h1>
          <p className="hero-description">
            Experience the most secure, transparent, and seamless voting platform dedicated to modern elections. Cast your voice with confidence.
          </p>
          <div className="hero-actions">
            {!user ? (
              <>
                <Link to="/signup" className="btn btn-primary btn-large">
                  Get Started
                  <ChevronRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-primary btn-large">
                    Admin Dashboard
                    <LayoutDashboard size={20} className="ml-2" />
                  </Link>
                ) : (
                  <Link to="/vote" className="btn btn-primary btn-large">
                    Cast Your Vote
                    <Vote size={20} className="ml-2" />
                  </Link>
                )}
                <Link to="/results" className="btn btn-outline btn-large">
                  View Results
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="hero-visual">
          <div className="visual-orb orb-1"></div>
          <div className="visual-orb orb-2"></div>
          <div className="hero-card glass">
            <div className="stats-box">
              <div className="stat-item">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Security Score</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">Instant</span>
                <span className="stat-label">Verification</span>
              </div>
            </div>
            <div className="card-mock-content">
              <div className="mock-bar" style={{ width: '80%', background: 'var(--primary)' }}></div>
              <div className="mock-bar" style={{ width: '60%', background: 'var(--secondary)' }}></div>
              <div className="mock-bar" style={{ width: '40%', background: 'var(--accent)' }}></div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="features-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card premium-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </motion.section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} VOTEX Ecosystem. Powering the next generation of decisions.</p>
      </footer>
    </div>
  );
};

export default Home;