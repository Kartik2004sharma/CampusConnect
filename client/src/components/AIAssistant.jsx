import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Zap } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am your AI campus assistant. How can I help you today?' }
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
      toast.error('Failed to analyze issue');
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: 'Sorry, I encountered an error analyzing your request.' }]);
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
      toast.success('Grievance submitted successfully!');
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: 'Your grievance has been quickly submitted. The relevant authorities have been notified.' }]);
      setAnalysisResult(null);
    } catch (error) {
      toast.error('Failed to submit grievance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-surface-2 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <h3 className="font-sora font-semibold">CampusConnect AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-surface border border-white/10 text-gray-200 rounded-bl-none'}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">
                      {line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-2xl bg-surface border border-primary/30 text-gray-200 rounded-bl-none">
                  <p className="text-sm mb-3">Would you like me to submit this as a formal grievance?</p>
                  <button 
                    onClick={handleQuickSubmit}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent text-white py-2 px-4 rounded-xl text-sm font-medium transition-all"
                  >
                    <Zap size={16} /> Quick Submit
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-white/10 p-3 rounded-2xl rounded-bl-none">
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-surface border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your issue..."
              className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default AIAssistant;
