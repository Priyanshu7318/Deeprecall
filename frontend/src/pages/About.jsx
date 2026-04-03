import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Shield, Users, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 relative overflow-hidden">
            {/* Animated ambient background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[140px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_reverse] pointer-events-none" />

            <Header />

            <main className="relative pt-32 pb-20 px-6 z-10 max-w-5xl mx-auto space-y-32">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        About <span className="neon-text">DeepRecall</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We're building the infrastructure for human memory. A secondary cognitive layer designed to ensure you never lose a brilliant thought again.
                    </p>
                </div>

                {/* Mission */}
                <div className="glass p-10 md:p-16 rounded-[40px] border border-white/10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            In an age of information overload, the human brain is bottlenecked not by storage capacity, but by recall speed. We forget 80% of what we learn within 24 hours. DeepRecall was founded to solve this biological limitation using artificial intelligence.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We believe that your memories, thoughts, and ideas are your most valuable assets. Our mission is to provide a secure, intelligent, and seamless extension to your mind.
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
                            <Brain className="w-48 h-48 text-primary relative z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]" />
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-16">Core Principles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass p-8 rounded-3xl border border-white/5 space-y-4 hover:border-primary/30 transition-colors group">
                            <Shield className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold">Total Privacy</h3>
                            <p className="text-gray-400">Your mind is private. Your digital brain should be too. We employ strict data isolation per user.</p>
                        </div>
                        <div className="glass p-8 rounded-3xl border border-white/5 space-y-4 hover:border-secondary/30 transition-colors group">
                            <Users className="w-10 h-10 text-secondary group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold">Human-Centric</h3>
                            <p className="text-gray-400">Technology should adapt to human behavior, not the other way around. We build for natural input.</p>
                        </div>
                        <div className="glass p-8 rounded-3xl border border-white/5 space-y-4 hover:border-accent/30 transition-colors group">
                            <Heart className="w-10 h-10 text-accent group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold">Empathetic AI</h3>
                            <p className="text-gray-400">Our models don't just read text; they understand intent and detect emotion to build a true diary.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center space-y-8">
                    <h2 className="text-3xl font-bold">Join the Team</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        We fall under the umbrella of future-focused neuro-tech. If you're passionate about extending human cognition, reach out to us.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/signup" className="btn-primary py-3 px-8">Try the App</Link>
                        <a href="mailto:careers@deeprecall.ai" className="glass py-3 px-8 border border-white/10 hover:bg-white/5 transition-colors rounded-xl font-medium">
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
