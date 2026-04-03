import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Mic, Calendar, Clock, MessageSquare,
  Brain, LayoutDashboard, CheckCircle, User,
  LogOut, Plus, ArrowRight, Zap, TrendingUp, Filter
} from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [memories, setMemories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [newMemory, setNewMemory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [memoryFilter, setMemoryFilter] = useState('All');
  const [recallResult, setRecallResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const filteredMemories = memoryFilter === 'All'
    ? memories
    : memories.filter(m => m.category === memoryFilter || (memoryFilter === 'Conversation' && !m.category));

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [memRes, taskRes, sumRes] = await Promise.all([
        axios.get('/api/memories', { headers }),
        axios.get('/api/tasks', { headers }),
        axios.get('/api/summaries', { headers })
      ]);
      setMemories(memRes.data.reverse());
      setTasks(taskRes.data.filter(t => t.status === 'Pending'));
      if (sumRes.data && sumRes.data.length > 0) {
        setSummary(sumRes.data[sumRes.data.length - 1]);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/memories',
        { text: newMemory, category: 'Manual Entry' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMemory('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecall = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/recall?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecallResult(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('audio', audioBlob, 'voice-memo.webm');

          try {
            await axios.post('/api/memories/audio', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            });
            fetchData();
          } catch (err) {
            console.error('Audio upload failed:', err);
          }

          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/summaries/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: 'Completed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden font-sans relative">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

      <Header />
      <div className="flex flex-1 pt-20 overflow-hidden relative z-10">
        <Sidebar className="backdrop-blur-xl bg-surface/50 border-r border-white/10" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Header */}
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-gray-400 font-medium">Welcome back,</h2>
                <h1 className="text-4xl font-bold mt-1 neon-text">{user.name}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="glass flex items-center px-4 py-2 space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </header>

            {/* Daily Insight Card */}
            <div className="lg:col-span-3">
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-secondary" />
                    Neural Summary
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className={`text-xs px-3 py-1 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/10 transition-all ${isGeneratingSummary ? 'animate-pulse' : ''}`}
                    >
                      {isGeneratingSummary ? 'Synthesizing...' : 'Regenerate'}
                    </button>
                    <span className="text-sm text-gray-400">Latest Insight</span>
                  </div>
                </div>
                {summary ? (
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed italic">
                      "{summary.summary}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-accent">
                        <Zap className="w-4 h-4 mr-1" />
                        Mood: {summary.mood_pattern}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No summaries generated yet. Capture more memories to see insights.</p>
                )}
              </div>
            </div>

            {/* Quick Input & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass p-6 space-y-4 border-primary/20">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Capture
                </h3>
                <form onSubmit={handleAddMemory} className="relative">
                  <textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="What's on your mind? Capture it instantly..."
                    className="w-full bg-surface border border-white/10 rounded-2xl p-4 pr-12 min-h-[120px] outline-none focus:border-primary/50 transition-all resize-none"
                  />
                  <div className="absolute right-4 bottom-4 flex space-x-2">
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'hover:bg-white/10'}`}
                    >
                      <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                    <button type="submit" className="p-2 bg-primary rounded-full hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-background" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="glass p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Neural Search
                </h3>
                <form onSubmit={handleRecall} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search past memories..."
                      className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-secondary/50 transition-all"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  <button type="submit" className="w-full btn-primary !bg-secondary !text-white text-sm py-3">
                    Recall Past Event
                  </button>
                </form>

                {recallResult && (
                  <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-secondary">Recall Found</span>
                      <span className="text-[10px] text-gray-500">Confidence: {(recallResult.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-gray-200 italic">"{recallResult.text}"</p>
                    {recallResult.source === 'summary' && (
                      <span className="inline-block mt-2 text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded">From Summaries</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Feed & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Memory Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Recent Memories
                  </h3>
                  <div className="flex items-center space-x-3">
                    <select
                      className="text-xs bg-surface border border-white/10 rounded px-2 py-1 text-gray-300 outline-none hover:border-primary/50 transition-colors"
                      value={memoryFilter}
                      onChange={(e) => setMemoryFilter(e.target.value)}
                    >
                      <option value="All">All Forms</option>
                      <option value="Manual Entry">Manual Entry</option>
                      <option value="Conversation">Conversation</option>
                    </select>
                    <button className="text-sm text-primary hover:underline flex items-center">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredMemories.length === 0 ? (
                    <div className="glass p-10 text-center text-gray-500 italic">
                      No memories match this filter, or none captured yet.
                    </div>
                  ) : (
                    filteredMemories.slice(0, 5).map((mem) => (
                      <div key={mem.memory_id} className="glass p-5 hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-400">
                            {mem.category || 'Conversation'}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-200 line-clamp-2">{mem.text}</p>
                        <div className="mt-3 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-primary flex items-center">
                            <Zap className="w-3 h-3 mr-1" /> {mem.intent}
                          </span>
                          <span className="text-[10px] text-secondary flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" /> {mem.emotion}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Task Summary */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-secondary" />
                  Neural Tasks
                </h3>
                <div className="glass p-6 space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 italic text-sm">No pending tasks</p>
                  ) : (
                    tasks.slice(0, 3).map((task) => (
                      <div key={task.task_id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                        <button
                          onClick={() => handleCompleteTask(task.task_id)}
                          title="Mark as completed"
                          className="w-4 h-4 rounded-full border border-primary hover:bg-primary transition-colors flex items-center justify-center group-hover:border-primary/50"
                        >
                          <CheckCircle className="w-3 h-3 text-background opacity-0 hover:opacity-100" />
                        </button>
                        <span className="flex-1 text-sm text-gray-300 truncate">{task.title}</span>
                        <Link to="/tasks">
                          <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" />
                        </Link>
                      </div>
                    ))
                  )}
                  <Link to="/tasks" className="w-full btn-primary py-2 text-xs flex items-center justify-center mt-4">
                    Manage All Tasks
                  </Link>
                </div>

                {/* Cognitive Status */}
                <div className="glass p-6 bg-gradient-to-br from-primary/10 to-transparent">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Neural Capacity</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Memory Load</span>
                        <span>64%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Focus Level</span>
                        <span>82%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full" style={{ width: '82%' }} />
                      </div>
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

export default Dashboard;
