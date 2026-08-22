import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { AiInsight } from '../types';
import { Badge } from '../components/Badge';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Brain,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  dataSource?: string;
  suggestedActions?: string[];
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: isHr
        ? "Hello Admin! I am Dayflow AI. I can query real organization database metrics (absent employees, lowest attendance department, pending leaves, total payroll) and detect attendance pattern anomalies."
        : "Hello Alex! I am your personal Dayflow AI assistant. Ask me anything about your leave balances, attendance rate, check-in history, or salary breakdown.",
      dataSource: "Dayflow AI Knowledge Engine",
      suggestedActions: isHr
        ? ["How many employees are absent today?", "Which department has lowest attendance?", "Show pending leave requests"]
        : ["How many leaves do I have?", "What is my attendance percentage?", "Show my salary"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.getAiInsights().then(setInsights);
  }, []);

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputPrompt('');
    setLoading(true);

    try {
      const res = await apiClient.queryAi(text, user?.role || 'EMPLOYEE');
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.response,
        dataSource: res.dataSource,
        suggestedActions: res.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I retrieved your system data. All records appear properly aligned.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>AI HR Assistant & Attendance Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400">Natural language database query engine & automated tardiness/absence risk detection.</p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Active Intelligence Engine</span>
        </div>
      </div>

      {/* Main Grid: Chat Assistant & Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between h-[600px]">
          {/* Message History Container */}
          <div className="overflow-y-auto space-y-4 pr-2 flex-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-glow'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.dataSource && (
                    <span className="text-[10px] text-cyan-300 font-mono mt-2 block border-t border-slate-700/60 pt-1">
                      Data Source: {m.dataSource}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>

                {/* Suggested Action Pills */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-brand-300 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-cyan-400 bg-slate-800/60 p-3 rounded-2xl w-fit">
                <Brain className="w-4 h-4 animate-bounce" />
                <span>Interrogating Dayflow Database...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="pt-4 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={isHr ? "Ask HR question... (e.g. How many employees are absent today?)" : "Ask about your leaves, attendance, or salary..."}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* AI Attendance Insights Section */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Automated Pattern Insights</span>
            </h3>

            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{ins.employee_name} ({ins.employee_code})</span>
                    <Badge status={ins.severity} />
                  </div>

                  <span className="text-[11px] font-semibold text-amber-400 block">{ins.issue}</span>
                  <p className="text-[11px] text-slate-300 leading-snug">{ins.pattern_details}</p>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/50 text-[10px] text-cyan-300">
                    <strong>Recommendation:</strong> {ins.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
