import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse]" />

      <Header />

      <div className="flex-1 flex items-center justify-center p-4 pt-24 z-10">
        <div className="w-full max-w-md relative group">
          {/* Subtle glowing halo behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

          <div className="glass relative w-full p-10 space-y-8 backdrop-blur-2xl border border-white/10 rounded-3xl bg-background/40">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 mb-4 shadow-[0_0_40px_rgba(var(--primary),0.3)]">
                <Brain className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                Welcome Back
              </h1>
              <p className="text-sm font-medium text-gray-400">Log in to unleash your digital second brain</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-primary transition-colors duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:bg-white/10 outline-none transition-all duration-300 shadow-inner"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                    <Link to="/forgot-password" size="sm" className="text-xs text-primary/80 hover:text-primary transition-colors hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-primary transition-colors duration-300" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:bg-white/10 outline-none transition-all duration-300 shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-[1px] group/btn transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02]">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                <div className="bg-background/80 backdrop-blur-md rounded-xl py-3 px-6 h-full flex items-center justify-center group-hover/btn:bg-transparent transition-colors duration-300">
                  <span className="font-bold text-white tracking-wide">Login</span>
                </div>
              </button>
            </form> 

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-sm font-medium text-gray-400">
                Don't have an account? {' '}
                <Link to="/signup" className="text-primary hover:text-white transition-colors hover:underline font-bold">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
