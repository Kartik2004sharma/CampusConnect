"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Zap } from 'lucide-react';
import api from '@/api/axios';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am Campus AI. Need help finding a building, tracking an event, or reporting an issue?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const res = await api.post('/ai/analyze-issue', { issueDescription: userText });
      const data = res.data;
      setAnalysisResult({ ...data, originalText: userText });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: `I've analyzed your issue.\n**Category**: ${data.category}\n**Urgency**: ${data.urgency}\n**Summary**: ${data.summary}\n\n**Suggestion**: ${data.suggestedAction}`
        }
      ]);
    } catch (error) {
      toast.error('Failed to communicate with Campus AI');
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: 'Sorry, I encountered an error connecting to the campus network.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSubmit = async () => {
    if (!analysisResult) return;
    setIsLoading(true);
    try {
      await api.post('/ai/quick-submit', {
        issueDescription: analysisResult.originalText,
        category: analysisResult.category,
        urgency: analysisResult.urgency,
        title: analysisResult.summary
      });
      toast.success('Complaint submitted successfully!');
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: 'Your complaint has been successfully submitted and routed to the correct department. You can track it in your dashboard.' }]);
      setAnalysisResult(null);
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-[380px] bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="bg-[var(--color-bg-surface)] p-4 flex justify-between items-center border-b border-[var(--color-border-default)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] leading-tight">Campus AI</h3>
                <p className="text-[10px] font-medium text-[var(--color-status-success)] uppercase tracking-wider">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[350px] max-h-[450px] space-y-4 bg-[var(--color-bg-page)] custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Sparkles size={12} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-[var(--color-brand-primary)] text-white rounded-br-none' : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-bl-none'}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-1.5 last:mb-0">
                      {line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }} />
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Quick Submit Action */}
            {analysisResult && !isLoading && (
              <div className="flex justify-start ml-8">
                <div className="max-w-[85%] p-4 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-brand-primary)]/30 text-[var(--color-text-primary)] rounded-bl-none shadow-sm">
                  <p className="text-sm font-medium mb-3">Would you like me to submit this as a formal complaint on your behalf?</p>
                  <button 
                    onClick={handleQuickSubmit}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    <Zap size={16} /> Yes, Submit Now
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start ml-8">
                <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={18} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-[var(--color-bg-surface)] border-t border-[var(--color-border-default)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[var(--color-brand-primary)] text-white p-2.5 rounded-xl hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm shrink-0"
            >
              <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all relative group"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform origin-center"></div>
        {isOpen ? <X size={24} className="relative z-10" /> : <Sparkles size={24} className="relative z-10" />}
      </button>
    </div>
  );
};

export default AIAssistant;
