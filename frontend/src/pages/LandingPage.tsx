import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { BrainCircuit, UploadCloud, Search, MessageSquareText, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-12 flex items-center justify-between max-w-7xl w-full mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">MindVault</span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button variant="primary" size="md" onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={() => navigate('/login')} className="text-slate-700 dark:text-slate-300">
                Sign In
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          Next-Gen AI Personal Knowledge Operating System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
          Your Knowledge Base, <br />
          <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 bg-clip-text text-transparent">
            Supercharged with Gemini RAG
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
          Upload PDF, DOCX, and Markdown files. Perform instant neural vector searches, chat with your documents using Gemini AI, and organize your knowledge seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button variant="primary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Start Free Vault
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
            Explore Demo
          </Button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full pt-8 border-t border-slate-200 dark:border-slate-800/60">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/50 shadow-xs transition-colors">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 w-fit mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Multi-Format Uploads</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag and drop PDFs, Office documents, code, and text files with real-time processing indicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/50 shadow-xs transition-colors">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 w-fit mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Semantic Vector Search</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Find exact knowledge snippets with similarity scores rather than relying on strict keywords.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/50 shadow-xs transition-colors">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 w-fit mb-4">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Chat with Citations</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask questions and receive accurate answers directly grounded in your document source excerpts.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500">
        MindVault AI OS &copy; {new Date().getFullYear()} — Production Knowledge Management System
      </footer>
    </div>
  );
};
