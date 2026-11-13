import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Scale,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { queryAIAssistant } from '../../services/aiAssistantService';
import { getLowestPrice } from '../../data/products';
import { useComparison } from '../../context/ComparisonContext';

export function ChatBot({
  initialQuery = '',
  fullPage = false,
  className = '',
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "👋 Welcome to **SmartShop AI**! I'm your real-time shopping copilot.\n\nI monitor prices across **Amazon, Flipkart, Croma**, and certified **nearby physical retail stores** in your city. How can I help you save today?",
      suggestedQuestions: [
        'Suggest a laptop under ₹60,000',
        'Which mobile has the best camera?',
        'Compare MacBook Air M3 and Dell XPS 13',
        'Find the cheapest iPhone',
        'Which nearby store has Sony WH-1000XM5?',
        'Recommend headphones under ₹2,000',
      ],
      recommendedProducts: [],
    },
  ]);

  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [thoughtStep, setThoughtStep] = useState('');
  const messagesEndRef = useRef(null);
  const { addToComparison, isInComparison } = useComparison();

  const handleSendMessage = useCallback(async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Realistic multi-step thought progression
    setThoughtStep('Analyzing price aggregations across Amazon, Flipkart & Croma...');
    const stepTimer1 = setTimeout(() => {
      setThoughtStep('Checking nearby physical retail inventory & store pricing...');
    }, 300);

    try {
      const response = await queryAIAssistant(queryText, messages);

      clearTimeout(stepTimer1);
      setThoughtStep('');

      const assistantMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        text: response.text,
        recommendedProducts: response.recommendedProducts || [],
        suggestedQuestions: response.suggestedQuestions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      clearTimeout(stepTimer1);
      setThoughtStep('');
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          text: 'Sorry, I encountered an issue while querying the price comparison engine. Please try asking again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, thoughtStep]);

  // Handle initialQuery if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, handleSendMessage]);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'Chat history cleared. What product would you like to search, compare, or track today?',
        suggestedQuestions: [
          'Suggest a laptop under ₹60,000',
          'Which mobile has the best camera?',
          'Find the cheapest iPhone',
        ],
        recommendedProducts: [],
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden ${
        fullPage ? 'h-[750px] max-h-[85vh]' : 'h-[580px]'
      } ${className}`}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-electric-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-electric">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-navy-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Ask SmartShop AI
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-electric-500/30 text-electric-300 border border-electric-400/30">
                Gemini Ready
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Live multi-retailer intelligence & local store radar
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1.5"
          title="Clear Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-navy-950 text-white shadow-xs'
                  : 'bg-gradient-to-tr from-electric-600 to-cyan-500 text-white shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className="space-y-3 flex-1 min-w-0">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-navy-950 text-white rounded-tr-none shadow-sm'
                    : 'bg-white border border-slate-200/90 text-navy-950 rounded-tl-none shadow-card'
                }`}
              >
                {/* Render Markdown-like paragraphs and bullets */}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i}>
                      {para.split('**').map((chunk, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className={msg.role === 'user' ? 'text-white' : 'text-navy-950 font-bold'}>
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>
              </div>

              {/* Embedded Product Recommendation Cards */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-electric-600" />
                    Recommended Product Deals:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.recommendedProducts.map((prod) => {
                      const { price, store } = getLowestPrice(prod);
                      const inComp = isInComparison(prod.id);

                      return (
                        <div
                          key={prod.id}
                          className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-electric-300 transition-all flex flex-col justify-between"
                        >
                          <div className="flex gap-2.5">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-electric-600 uppercase">
                                {prod.brand} • {prod.category}
                              </span>
                              <h5 className="text-xs font-bold text-navy-950 line-clamp-1">
                                {prod.name}
                              </h5>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-xs font-black text-navy-950">
                                  ₹{price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  on {store?.name || 'Amazon'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => addToComparison(prod)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
                                inComp
                                  ? 'bg-electric-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              <Scale className="w-3 h-3" />
                              <span>{inComp ? 'Comparing' : 'Compare'}</span>
                            </button>

                            <Link
                              to={`/product/${prod.id}`}
                              className="text-[10px] font-bold text-electric-600 hover:text-electric-700 flex items-center gap-1"
                            >
                              <span>View Specs</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Questions */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedQuestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200/90 text-slate-700 hover:bg-electric-50 hover:text-electric-600 hover:border-electric-200 transition-all text-left shadow-2xs"
                    >
                      💬 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading / Thought Step Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-navy-950 rounded-tl-none shadow-card space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-electric-600">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-electric-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-electric-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-electric-600 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>SmartShop AI Thinking...</span>
              </div>
              {thoughtStep && (
                <p className="text-xs text-slate-500 animate-pulse">{thoughtStep}</p>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Laptop under 60k', 'Best camera phone', 'Cheapest iPhone')..."
              className="w-full pl-4 pr-10 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-electric-600 focus:ring-2 focus:ring-electric-100"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-navy-950 hover:bg-navy-900 disabled:opacity-40 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            title="Send Message"
          >
            <Send className="w-4 h-4 text-electric-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
