import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Circle, Plus, Trash2,
  Filter, Tag, ArrowLeft, Brain, Calendar
} from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', category: 'Work', priority: 'Medium' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTasks();
     
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', category: 'Work', priority: 'Medium' });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.task_id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden font-sans relative">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

      <Header />
      <div className="flex flex-1 pt-20 overflow-hidden relative z-10">
        <Sidebar className="backdrop-blur-xl bg-surface/50 border-r border-white/10" />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold neon-text">Task Management</h1>
                  <p className="text-gray-400">Organize your cognitive workload</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 glass px-4 py-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">AI Prioritization Active</span>
              </div>
            </header>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="glass p-6 mb-8 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="What needs to be remembered?"
                className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-primary"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <select
                className="bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Health</option>
                <option>Learning</option>
              </select>
              <button type="submit" className="btn-primary px-6 py-2 flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading neural tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                  <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No active tasks. Your mind is clear.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className={`glass p-4 flex items-center justify-between group transition-all ${task.status === 'Completed' ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTaskStatus(task.task_id, task.status)}
                        className="text-primary hover:scale-110 transition-transform"
                      >
                        {task.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.status === 'Completed' ? 'line-through' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {task.category}
                          </span>
                          <span className="flex items-center text-[10px] text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.task_id)}
                      className="p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
