import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface } from '@/components/glass';
import { useStore } from '@/store';
import { Send, Paperclip, Bot, User } from 'lucide-react';

const quickReplies = [
  'I need help with a transfer',
  'My account is locked',
  'Question about fees',
  'Report fraud',
];

const botResponses: Record<string, string> = {
  'I need help with a transfer': 'I can help with that! Could you please provide the transaction ID or the recipient name?',
  'My account is locked': 'I understand your concern. Let me check your account status. One moment please...',
  'Question about fees': 'Our transfer fees are 0.5% for standard transfers and free between OrbitPay Credit Union accounts.',
  'Report fraud': 'This is serious. I am immediately connecting you with our security team.',
};

export default function ChatScreen() {
  const { user, chatRooms, chatMessages, addChatMessage } = useStore();
  const [messageText, setMessageText] = useState('');
  const [activeRoom] = useState<string | null>(null);
  const [showBot] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userRoom = chatRooms.find((r) => r.userId === user?.id);
  const roomMessages = chatMessages.filter((m) => m.roomId === (activeRoom || userRoom?.id));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  if (!user) return null;

  const handleSend = () => {
    if (!messageText.trim()) return;

    const roomId = activeRoom || userRoom?.id || 'room_user';
    const newMessage = {
      id: `msg_${Date.now()}`,
      roomId,
      senderId: user.id,
      senderType: 'user' as const,
      senderName: user.fullName,
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    addChatMessage(newMessage);
    setMessageText('');

    // Bot response
    if (showBot) {
      setTimeout(() => {
        const botReply = botResponses[messageText] || 'Thank you for your message. A support agent will be with you shortly.';
        const botMessage = {
          id: `msg_bot_${Date.now()}`,
          roomId,
          senderId: 'bot',
          senderType: 'admin' as const,
          senderName: 'Support Bot',
          content: botReply,
          createdAt: new Date().toISOString(),
        };
        addChatMessage(botMessage);
      }, 1000);
    }
  };

  return (
    <div className="h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#A8E6CF]/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#0A0A0A]" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-medium text-[#0A0A0A]">Support</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              <span className="text-xs text-[#0A0A0A]/50">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3 scrollbar-hide">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#A8E6CF]/30 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <GlassSurface className="px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
            <p className="text-sm text-[#0A0A0A]">
              Hello {user.fullName.split(' ')[0]}! I'm your OrbitPay Credit Union assistant. How can I help you today?
            </p>
          </GlassSurface>
        </motion.div>

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 pl-10">
          {quickReplies.map((reply) => (
            <motion.button
              key={reply}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMessageText(reply);
                setTimeout(() => handleSend(), 100);
              }}
              className="glass-pill px-3 py-2 text-xs font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] hover:bg-white/30 transition-colors"
            >
              {reply}
            </motion.button>
          ))}
        </div>

        {/* Chat Messages */}
        <AnimatePresence>
          {roomMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.senderType === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.senderType === 'user'
                  ? 'bg-[#DDA0DD]/30'
                  : 'bg-[#A8E6CF]/30'
              }`}>
                {msg.senderType === 'user' ? (
                  <User className="w-4 h-4 text-[#0A0A0A]" />
                ) : (
                  <Bot className="w-4 h-4 text-[#0A0A0A]" />
                )}
              </div>
              <GlassSurface
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg.senderType === 'user'
                    ? 'rounded-tr-none bg-[#DDA0DD]/20'
                    : 'rounded-tl-none'
                }`}
              >
                <p className="text-sm text-[#0A0A0A]">{msg.content}</p>
                <p className="text-[10px] text-[#0A0A0A]/30 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </GlassSurface>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {showBot && messageText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#A8E6CF]/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <GlassSurface className="px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0A0A0A]/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0A0A0A]/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0A0A0A]/30 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </GlassSurface>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 pb-28">
        <div className="flex items-center gap-2 glass-surface-strong rounded-2xl px-4 py-2">
          <button className="w-8 h-8 flex items-center justify-center text-[#0A0A0A]/30 hover:text-[#0A0A0A]/60">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-[#0A0A0A] placeholder:text-[#0A0A0A]/30 outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!messageText.trim()}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              messageText.trim()
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-[#0A0A0A]/10 text-[#0A0A0A]/30'
            }`}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
