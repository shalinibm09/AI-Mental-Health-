import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Shield, MessageSquare, Heart, Info, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './components/ChatMessage';
import { EmergencyBanner } from './components/EmergencyBanner';
import { MetadataForm } from './components/MetadataForm';
import { CopingTools } from './components/CopingTools';
import { getChatResponse, Message, UserMetadata } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello. I'm Serenity, your AI mental health support assistant. I'm here to listen and provide a safe space for you to express yourself. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [metadata, setMetadata] = useState<UserMetadata>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assessment, setAssessment] = useState<string>('Safe');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getChatResponse([...messages, userMessage], metadata);
      
      setAssessment(result.assessment);
      setMessages(prev => [...prev, { role: 'model', content: result.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "I'm sorry, I'm having trouble responding. If you're in immediate danger, please call emergency services." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetadataSubmit = (data: UserMetadata) => {
    setMetadata(data);
    setShowMetadataForm(false);
    // Optionally send a hidden message to AI to acknowledge metadata
  };

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-stone-100 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-stone-800 rounded-2xl flex items-center justify-center text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Serenity</h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Mental Health Support</p>
          </div>
        </div>

        <CopingTools />

        <div className="mt-auto pt-8">
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
            <div className="flex items-center gap-2 mb-2 text-stone-800">
              <Shield size={16} />
              <span className="text-xs font-semibold">Privacy First</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              Your conversations are private and not stored permanently. This is a triage tool, not a clinical replacement.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-6 flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-stone-800" fill="currentColor" />
                  <h1 className="font-bold text-lg">Serenity</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-stone-400">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <CopingTools />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-500 hover:bg-stone-50 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                assessment === 'Crisis' || assessment === 'High Concern' ? "bg-red-500" : "bg-green-500"
              )} />
              <span className="text-xs font-medium text-stone-500">
                Status: <span className={cn(
                  "font-bold",
                  assessment === 'Crisis' || assessment === 'High Concern' ? "text-red-600" : "text-stone-800"
                )}>{assessment}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMetadataForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 rounded-full transition-colors"
            >
              <Plus size={14} />
              {metadata.location ? 'Update Context' : 'Add Context'}
            </button>
            <div className="h-4 w-[1px] bg-stone-200 mx-1" />
            <button className="p-2 text-stone-400 hover:text-stone-600">
              <Info size={18} />
            </button>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-4 scrollbar-hide">
          <div className="max-w-3xl mx-auto w-full">
            {(assessment === 'Crisis' || assessment === 'High Concern') && <EmergencyBanner />}
            
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-6 animate-pulse">
                <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 lg:p-8 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              rows={1}
              placeholder="How are you feeling right now?"
              className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm resize-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all",
                input.trim() && !isLoading 
                  ? "bg-stone-800 text-white hover:bg-stone-900" 
                  : "bg-stone-100 text-stone-300 cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-stone-400 mt-4">
            Serenity is an AI assistant and not a medical professional. In an emergency, call your local emergency services.
          </p>
        </div>
      </main>

      {/* Metadata Form Modal */}
      <AnimatePresence>
        {showMetadataForm && (
          <MetadataForm 
            onSubmit={handleMetadataSubmit} 
            onClose={() => setShowMetadataForm(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
