import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobile: '',
        email: '',
        address: '',
        adharCardNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const sanitizedFormData = {
                ...formData,
                adharCardNumber: formData.adharCardNumber.trim().replace(/\s/g, ''),
                mobile: formData.mobile.trim().replace(/\s/g, '')
            };
            const response = await api.post('/users/signup', sanitizedFormData);
            login(response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-2xl"
            >
                <h1 className="text-4xl font-extrabold mb-2 gradient-text">Voter Registration</h1>
                <p className="text-dim mb-10 text-lg">Onboard to the most secure voting ecosystem in the world</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-dim">Full Name</label>
                        <input name="name" type="text" className="input-field text-white" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-dim">Email (Optional)</label>
                        <input name="email" type="email" className="input-field text-white" value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-dim">Mobile Number</label>
                        <input name="mobile" type="text" className="input-field text-white" value={formData.mobile} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-dim">Adhar Card Number (12 digits)</label>
                        <input name="adharCardNumber" type="text" className="input-field text-white" value={formData.adharCardNumber} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-dim">Age</label>
                        <input name="age" type="number" className="input-field text-white" value={formData.age} onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-dim">Address</label>
                        <input name="address" type="text" className="input-field text-white" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-dim">Password</label>
                        <input name="password" type="password" className="input-field text-white" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        {error && (
                            <div className="bg-error/10 text-error p-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-error/20">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <UserPlus size={20} />
                                    Register Account
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-8 text-dim text-sm">
                    Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
