import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Zap, Shield, Search, Mic,
  ArrowRight, CheckCircle, TrendingUp,
  MessageSquare, Layout, Sparkles
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 relative overflow-hidden">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden z-10">

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Neural Memory is Here</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
            Capture Your Thoughts, <br />
            <span className="neon-text">Infinite Recall.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            DeepRecall is your secondary digital brain. It captures conversations,
            understands intent, and builds a permanent neural library of your life's memories.
          </p>

          <div className="flex flex-col md:row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 pt-6">
            <Link to="/signup" className="btn-primary py-4 px-10 text-lg flex items-center group">
              Start Building Your Legacy
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/#how-it-works" className="glass py-4 px-10 text-lg border border-white/10 hover:bg-white/5 transition-all">
              See How it Works
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xs uppercase tracking-widest font-bold">End-to-End Privacy</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Zap className="w-6 h-6 text-secondary" />
              <span className="text-xs uppercase tracking-widest font-bold">Real-time NLP</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Search className="w-6 h-6 text-accent" />
              <span className="text-xs uppercase tracking-widest font-bold">Semantic Search</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Layout className="w-6 h-6 text-white" />
              <span className="text-xs uppercase tracking-widest font-bold">Data Isolation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold">Neural Capabilities</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Engineered to mimic the biological functions of the human brain,
              scaled with the power of modern artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-primary" />}
              title="Voice & Text Input"
              description="Capture thoughts as they happen. Whether it's a quick text or a long voice memo, DeepRecall processes everything with precision."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-secondary" />}
              title="Daily Summarization"
              description="Our AI reads your raw memories daily and weekly to generate structured diaries and detect emotional mood patterns."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-accent" />}
              title="Intelligent Recall"
              description="Ask natural questions like 'What did I do yesterday?' and receive immediate, context-aware answers with confidence scores."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Data Isolation"
              description="Every user gets a private, isolated database. Your memories are your own, stored securely and never accessible by others."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-secondary" />}
              title="Intent Analysis"
              description="DeepRecall doesn't just store text; it understands if you're setting a task, sharing an emotion, or asking a query."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-accent" />}
              title="Task Management"
              description="Integrated task service automatically categorizes and tracks your commitments based on your memory feed."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Designed for the <br />
              <span className="text-primary">Human Experience.</span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                DeepRecall was born from a simple question: What if we never had to worry about forgetting a brilliant idea,
                a cherished conversation, or a critical task again?
              </p>
              <p>
                Our architecture is built on six cognitive layers: Input, NLP Understanding, Memory Storage,
                Summarization, Recall, and Output. This mimics the human brain's natural flow,
                allowing for a seamless transition between raw data and meaningful insight.
              </p>
            </div>
            <div className="pt-4">
              <Link to="/signup" className="text-primary font-bold flex items-center group">
                Join the Neural Revolution
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Neural Engine Status</h4>
                  <p className="text-xs text-green-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    All Systems Operational
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[65%]" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[92%]" />
                </div>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Users</p>
                  <p className="text-2xl font-bold">12.4k</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Memories</p>
                  <p className="text-2xl font-bold">2.1M</p>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[40px] border border-white/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Brain className="w-64 h-64 text-white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ready to enhance your <br />
            <span className="neon-text">Cognitive Power?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Secure your spot in the future of personal memory.
            Sign up for the beta today.
          </p>
          <div className="pt-6">
            <Link to="/signup" className="btn-primary py-4 px-12 text-lg inline-block">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass p-8 border border-white/5 hover:border-primary/30 transition-all group">
    <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

export default Home;
