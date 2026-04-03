import React from 'react';
import { Link } from 'react-router-dom';
import {
    Brain, Mic, Database, Zap, Search, Lock,
    ArrowRight, Activity, Layers, Cpu
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 relative overflow-hidden">
            {/* Animated ambient background */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

            <Header />

            <main className="relative pt-32 pb-20 px-6 z-10 max-w-6xl mx-auto">
                <div className="text-center space-y-6 mb-20 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-secondary">
                        <Cpu className="w-4 h-4" />
                        <span>The Architecture of Memory</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        How DeepRecall <span className="neon-text">Works</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Our system is designed to mimic human cognition. It ingests your raw thoughts, processes them for meaning, and stores them in a semantic vector space.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <ProcessStep
                        number="01"
                        icon={<Mic className="w-8 h-8 text-primary" />}
                        title="Data Capture"
                        description="DeepRecall accepts multimodal input. Speak into the Neural Dash microphone for automated Whisper transcription, or type out unstructured thoughts."
                    />
                    <ProcessStep
                        number="02"
                        icon={<Brain className="w-8 h-8 text-secondary" />}
                        title="Cognitive Processing"
                        description="Our custom Natural Language Processing pipeline analyzes every input for intent (task, thought, event), emotional weight, and key entities."
                    />
                    <ProcessStep
                        number="03"
                        icon={<Database className="w-8 h-8 text-accent" />}
                        title="Vector Memory Storage"
                        description="Your memories are converted into high-dimensional embeddings and stored in your isolated ChromaDB instance for semantic similarity matching."
                    />
                    <ProcessStep
                        number="04"
                        icon={<Zap className="w-8 h-8 text-primary" />}
                        title="Nightly Synthesis"
                        description="While you sleep, DeepRecall cross-references your daily inputs to generate coherent diary entries, tracking your mood and cognitive load over time."
                    />
                    <ProcessStep
                        number="05"
                        icon={<Search className="w-8 h-8 text-secondary" />}
                        title="Instinctual Recall"
                        description="When you need an answer, simply query the Neural Search. DeepRecall fetches semantically related memories instantly, providing you with context-rich answers."
                    />
                    <ProcessStep
                        number="06"
                        icon={<Lock className="w-8 h-8 text-accent" />}
                        title="Absolute Isolation"
                        description="Your digital brain is locked down. Data is isolated per user, meaning your semantic memory banks are never mixed with the global collective."
                    />
                </div>

                <div className="mt-32 glass p-12 rounded-[40px] text-center space-y-8 border border-white/10">
                    <h2 className="text-3xl md:text-5xl font-bold">Ready to digitize your mind?</h2>
                    <p className="text-gray-400">Join the thousands of users already expanding their cognitive capacity.</p>
                    <Link to="/signup" className="btn-primary py-4 px-10 text-lg inline-flex items-center group">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const ProcessStep = ({ number, icon, title, description }) => (
    <div className="flex space-x-6 group">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:text-white group-hover:border-primary/50 transition-all group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                {number}
            </div>
            <div className="w-0.5 h-full bg-gradient-to-b from-white/10 to-transparent mt-4 group-hover:from-primary/30 transition-colors" />
        </div>
        <div className="flex-1 pb-16">
            <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    </div>
);

export default HowItWorks;
