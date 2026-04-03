import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="glass w-full max-md p-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold neon-text">Reset Password</h1>
          <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg text-sm">{message}</div>}
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:border-primary outline-none transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3">
            Send Reset Link
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ForgotPassword;
