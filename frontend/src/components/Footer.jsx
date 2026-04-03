import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-xl shadow-neon">
              <Brain className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">DeepRecall</span>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            The world's first decentralized neural memory assistant. Capturing the essence of human thought through advanced NLP and secure data isolation.
          </p>
          <div className="flex items-center space-x-5">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold">Platform</h4>
          <ul className="space-y-4">
            <li><Link to="/#features" className="text-gray-500 hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Neural Dashboard</Link></li>
            <li><Link to="/tasks" className="text-gray-500 hover:text-primary transition-colors">Task Management</Link></li>
            <li><Link to="/signup" className="text-gray-500 hover:text-primary transition-colors">Join Beta</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold">Resources</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">API Reference</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Security Policy</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center text-sm text-gray-600 space-y-4 md:space-y-0">
        <p>© 2026 DeepRecall AI. All neural rights reserved.</p>
        <div className="flex items-center space-x-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
