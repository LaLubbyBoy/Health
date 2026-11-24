import React, { useState } from 'react';
import { Bot, Send, ShieldAlert, Sparkles, User as UserIcon, AlertTriangle } from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: "Hello! I am your Medicare Connect AI Health Assistant. I can help you understand symptoms, explain medical terminology, prepare questions for your doctor, and find appropriate medical specialties. Please note: I provide general health guidance and do not replace professional medical diagnosis. For any medical emergency, please visit a hospital immediately.",
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMsgs = [...messages, { sender: 'user' as const, text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: newMsgs })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages([...newMsgs, { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err: any) {
      setMessages([...newMsgs, { sender: 'ai', text: "I encountered a connection error. Please try again or consult one of our verified doctors.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-800 rounded-3xl p-8 text-white shadow-xl flex items-center space-x-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 text-emerald-300">
          <Bot className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Google Gemini Powered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Medicare Connect AI Health Assistant</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">Get instant symptom triage, health education, and specialty recommendations with strict safety safeguards.</p>
        </div>
      </div>

      {/* Emergency Warning */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Medical Notice:</span> AI-generated guidance is for educational and informational purposes only. It does not constitute a formal medical diagnosis or prescription. Always consult qualified physicians for medical care.
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col h-[550px] overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold text-xs ${m.sender === 'user' ? 'bg-emerald-600' : 'bg-teal-800'}`}>
                {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-tl-none'}`}>
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-1 ${m.sender === 'user' ? 'text-emerald-200 text-right' : 'text-gray-400'}`}>{m.time}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-gray-500">
                Analyzing health query securely with Gemini AI...
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200 flex items-center space-x-3">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a health question..."
            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl shadow-md transition flex items-center space-x-2 font-semibold text-sm"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
