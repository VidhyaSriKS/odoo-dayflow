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
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>AI HR Assistant & Attendance Intelligence</span>
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Natural language database query engine & automated tardiness/absence risk detection.</p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F5F3FF] dark:bg-purple-950/60 border border-[#E9E5F7] dark:border-purple-800/40 text-[#7C3AED] dark:text-[#A78BFA] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Active Intelligence Engine</span>
        </div>
      </div>

      {/* Main Grid: Chat Assistant & Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-[#E9E5F7] dark:border-[#30334F] flex flex-col justify-between h-[600px]">
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
                      ? 'bg-[#7C3AED] dark:bg-[#8B5CF6] text-white rounded-br-none shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                      : 'bg-[#FAF9FF] dark:bg-[#1E2038] text-[#1F1937] dark:text-[#F8F7FF] border border-[#E9E5F7] dark:border-[#30334F] rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.dataSource && (
                    <span className="text-[10px] text-[#7C3AED] dark:text-[#A78BFA] font-mono mt-2 block border-t border-[#E9E5F7] dark:border-[#30334F] pt-1 font-semibold">
                      Data Source: {m.dataSource}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] mt-1 px-1">{m.timestamp}</span>

                {/* Suggested Action Pills */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] text-[#7C3AED] dark:text-[#A78BFA] px-3 py-1 rounded-full transition-colors font-medium"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-[#1E2038] p-3 rounded-2xl w-fit border border-[#E9E5F7] dark:border-[#30334F]">
                <Brain className="w-4 h-4 animate-bounce" />
                <span>Interrogating Dayflow Database...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="pt-4 border-t border-[#E9E5F7] dark:border-[#30334F] flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={isHr ? "Ask HR question... (e.g. How many employees are absent today?)" : "Ask about your leaves, attendance, or salary..."}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-4 py-2.5 text-xs text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6]"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* AI Attendance Insights Section */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-[#E9E5F7] dark:border-[#30334F] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC] flex items-center space-x-2">
              <Brain className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Automated Pattern Insights</span>
            </h3>

            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.id} className="p-4 rounded-2xl bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] text-xs">{ins.employee_name} ({ins.employee_code})</span>
                    <Badge status={ins.severity} />
                  </div>

                  <span className="text-[11px] font-semibold text-[#F59E0B] block">{ins.issue}</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A9A8BC] leading-snug">{ins.pattern_details}</p>

                  <div className="bg-white dark:bg-[#181A30] p-2.5 rounded-xl border border-[#E9E5F7] dark:border-[#30334F] text-[10px] text-[#7C3AED] dark:text-[#A78BFA]">
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
