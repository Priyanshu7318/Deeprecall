import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Calendar, Activity, Shield,
  ArrowLeft, Edit3, Save, TrendingUp, Brain
} from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

const Profile = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
     
  }, []);

  const moodData = [
    { name: 'Happy', value: 45, color: '#00f2ff' },
    { name: 'Neutral', value: 30, color: '#7000ff' },
    { name: 'Sad', value: 10, color: '#ff00c8' },
    { name: 'Anxious', value: 15, color: '#facc15' },
  ];

  const activityData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 30 },
    { day: 'Sun', count: 28 },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden font-sans relative">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

      <Header />
      <div className="flex flex-1 pt-20 overflow-hidden relative z-10">
        <Sidebar className="backdrop-blur-xl bg-surface/50 border-r border-white/10" />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="glass px-4 py-2 flex items-center space-x-2 hover:border-primary transition-colors"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Info Card */}
              <div className="lg:col-span-1 space-y-8">
                <div className="glass p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=00f2ff&color=0a0a0c&size=128`}
                      className="w-32 h-32 rounded-full border-4 border-primary/20 p-1"
                      alt="Profile"
                    />
                    <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-neon">
                      <Shield className="w-4 h-4 text-background" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-primary font-medium text-sm mt-1 uppercase tracking-widest">{user.memory_mode} Mode</p>

                  <div className="mt-8 space-y-4 text-left">
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Member since Feb 2026</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">Age: {profile.age || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Mood Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {moodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#16161a', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {moodData.map((m, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-[10px] text-gray-400">{m.name}: {m.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Detailed Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6">
                    <h3 className="text-gray-400 text-sm mb-1">Memory Retention</h3>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold">99.4%</span>
                      <span className="text-green-400 text-xs mb-1">+0.2% this month</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-4">
                      <div className="bg-primary h-full rounded-full" style={{ width: '99.4%' }} />
                    </div>
                  </div>
                  <div className="glass p-6">
                    <h3 className="text-gray-400 text-sm mb-1">Total Insights</h3>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold">1,284</span>
                      <span className="text-primary text-xs mb-1">Top 5% user</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-4">
                      <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                <div className="glass p-8">
                  <h3 className="text-xl font-bold mb-8 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-secondary" />
                    Cognitive Activity (7 Days)
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#16161a', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#00f2ff' : '#7000ff'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8">
                  <h3 className="text-xl font-bold mb-6">Account Security</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Shield className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Data Encryption</p>
                          <p className="text-xs text-gray-500">AES-256 local storage encryption is active</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-500 font-bold uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Automatic Backups</p>
                          <p className="text-xs text-gray-500">Last backup: 2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary font-bold uppercase">Daily</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
