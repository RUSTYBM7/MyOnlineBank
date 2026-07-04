import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface, GlassCard, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  Send, Paperclip, Search, User, Bot,
  Flag, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickReplies = [
  'Thank you for contacting us!',
  'Let me check that for you.',
  'Your issue has been resolved.',
  'Please provide more details.',
  'I am transferring you to a specialist.',
];

export default function AdminChat() {
  const { chatRooms, chatMessages, users, addChatMessage, markRoomRead, activeChatRoom, setActiveChatRoom } = useStore();
  const [messageText, setMessageText] = useState('');
  const [chatFilter, setChatFilter] = useState('all');
  const [searchChat, setSearchChat] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredRooms = chatRooms
    .filter((r) => {
      if (chatFilter === 'unread') return r.unreadCount > 0;
      if (chatFilter === 'flagged') return r.status === 'flagged';
      if (chatFilter === 'resolved') return r.status === 'resolved';
      return true;
    })
    .filter((r) => r.userName.toLowerCase().includes(searchChat.toLowerCase()))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  const roomMessages = chatMessages.filter((m) => m.roomId === activeChatRoom);
  const activeRoom = chatRooms.find((r) => r.id === activeChatRoom);
  const roomUser = activeRoom ? users.find((u) => u.id === activeRoom.userId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length, activeChatRoom]);

  const handleSend = () => {
    if (!messageText.trim() || !activeChatRoom) return;
    const newMessage = {
      id: `msg_admin_${Date.now()}`,
      roomId: activeChatRoom,
      senderId: 'admin_2',
      senderType: 'admin' as const,
      senderName: 'Support Team',
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    addChatMessage(newMessage);
    setMessageText('');
  };

  const handleRoomClick = (roomId: string) => {
    setActiveChatRoom(roomId);
    markRoomRead(roomId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A0A0A]">B2B Chat System</h1>
        <p className="text-sm text-[#0A0A0A]/50">{chatRooms.reduce((s, r) => s + r.unreadCount, 0)} unread messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Chat List */}
        <GlassCard className="overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/20 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/30" />
              <input
                type="text"
                value={searchChat}
                onChange={(e) => setSearchChat(e.target.value)}
                placeholder="Search conversations..."
                className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'unread', 'flagged', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setChatFilter(f)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                    chatFilter === f ? 'bg-[#0A0A0A] text-white' : 'text-[#0A0A0A]/40 hover:text-[#0A0A0A]'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/10">
            {filteredRooms.map((room) => (
              <motion.button
                key={room.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoomClick(room.id)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-white/20',
                  activeChatRoom === room.id ? 'bg-white/30' : ''
                )}
              >
                <div className="relative flex-shrink-0">
                  <img src={room.userAvatar} alt="" className="w-10 h-10 rounded-full" />
                  {room.isUserOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2ECC71] rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#0A0A0A]">{room.userName}</p>
                    <span className="text-[10px] text-[#0A0A0A]/30">
                      {new Date(room.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#0A0A0A]/50 truncate mt-0.5">{room.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {room.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#FF6B6B] text-white text-[10px] rounded-full font-medium">
                        {room.unreadCount}
                      </span>
                    )}
                    {room.status === 'flagged' && (
                      <Flag className="w-3 h-3 text-[#FF6B6B]" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          {activeRoom ? (
            <GlassCard className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeRoom.userAvatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">{activeRoom.userName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full', activeRoom.isUserOnline ? 'bg-[#2ECC71]' : 'bg-[#0A0A0A]/20')} />
                      <span className="text-xs text-[#0A0A0A]/40">{activeRoom.isUserOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {roomUser && (
                    <GlassBadge variant="mint" size="sm">${roomUser.balanceUsd.toLocaleString()}</GlassBadge>
                  )}
                  <button className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                    <Flag className="w-4 h-4 text-[#0A0A0A]/30" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {roomMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex gap-2', msg.senderType === 'admin' ? 'flex-row-reverse' : '')}
                    >
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                        msg.senderType === 'admin' ? 'bg-[#A8E6CF]/30' : 'bg-[#DDA0DD]/30'
                      )}>
                        {msg.senderType === 'admin' ? (
                          <Bot className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        )}
                      </div>
                      <GlassSurface
                        className={cn(
                          'px-4 py-2.5 rounded-2xl max-w-[70%]',
                          msg.senderType === 'admin' ? 'rounded-tr-none bg-[#A8E6CF]/15' : 'rounded-tl-none'
                        )}
                      >
                        <p className="text-sm text-[#0A0A0A]">{msg.content}</p>
                        <p className="text-[10px] text-[#0A0A0A]/30 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </GlassSurface>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => {
                      setMessageText(reply);
                      setTimeout(() => handleSend(), 50);
                    }}
                    className="flex-shrink-0 glass-pill px-3 py-1.5 text-xs text-[#0A0A0A]/60 hover:text-[#0A0A0A] hover:bg-white/30 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center gap-2 glass-surface-strong rounded-2xl px-4 py-2">
                  <button className="w-8 h-8 flex items-center justify-center text-[#0A0A0A]/30">
                    <Paperclip className="w-4 h-4" />
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
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      messageText.trim() ? 'bg-[#0A0A0A] text-white' : 'bg-[#0A0A0A]/10 text-[#0A0A0A]/30'
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-3" />
                <p className="text-[#0A0A0A]/40">Select a conversation to start</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
