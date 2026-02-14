import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { LogIn, Key, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [adharCardNumber, setAdharCardNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const sanitizedAdhar = adharCardNumber.trim().replace(/\s/g, '');
            const response = await api.post('/users/login', { adharCardNumber: sanitizedAdhar, password });
            login(response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card auth-card"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <LogIn size={120} />
                </div>
                <h1 className="text-4xl font-extrabold mb-2 gradient-text">Secure Access</h1>
                <p className="text-dim mb-10 text-lg">Identity verification for the digital voting gate</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-dim">Adhar Card Number</label>
                        <input
                            type="text"
                            className="input-field text-white"
                            value={adharCardNumber}
                            onChange={(e) => setAdharCardNumber(e.target.value)}
                            required
                            placeholder="12-digit number"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1 text-dim">Password</label>
                        <input
                            type="password"
                            className="input-field text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-error/10 text-error p-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-error/20">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-dim text-sm">
                    New voter? <Link to="/signup" className="text-primary font-semibold hover:underline">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
