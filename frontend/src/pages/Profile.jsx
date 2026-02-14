import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  User,
  Shield,
  Contact,
  Phone,
  Mail,
  MapPin,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await api.get('/users/profile');
      setProfile(data.user);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to retrieve profile';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put('/users/profile/password', passData);
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Update failed',
        type: 'error'
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <Loader2 size={48} className="spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <AlertCircle size={70} />
        <h2>Profile Sync Failed</h2>
        <p>{message.text}</p>
        <button onClick={fetchProfile} className="btn-primary">
          <RefreshCw size={18} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-grid">

        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="profile-card"
        >
          <div className="profile-header">
            <User size={48} />
            <h2>{profile.name}</h2>
            <span className="role-badge">{profile.role}</span>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <Shield size={18} />
              <div>
                <small>Status</small>
                <strong>
                  {profile.isVoted ? 'Vote Cast' : 'Eligible to Vote'}
                </strong>
              </div>
            </div>

            <div className="info-item">
              <Contact size={18} />
              <div>
                <small>Adhar Number</small>
                <strong>{profile.adharCardNumber}</strong>
              </div>
            </div>

            {profile.email && (
              <div className="info-item">
                <Mail size={18} />
                <div>
                  <small>Email</small>
                  <strong>{profile.email}</strong>
                </div>
              </div>
            )}

            <div className="info-item">
              <Phone size={18} />
              <div>
                <small>Mobile</small>
                <strong>{profile.mobile}</strong>
              </div>
            </div>

            <div className="info-item">
              <MapPin size={18} />
              <div>
                <small>Address</small>
                <strong>{profile.address}</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="security-card"
        >
          <h3>
            <Key size={18} />
            Account Security
          </h3>

          <form onSubmit={handleUpdatePassword} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passData.oldPassword}
                onChange={(e) =>
                  setPassData({ ...passData, oldPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passData.newPassword}
                onChange={(e) =>
                  setPassData({ ...passData, newPassword: e.target.value })
                }
                required
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={updating}>
              {updating ? <Loader2 className="spin" size={18} /> : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
