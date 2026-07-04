// ============================================================
// OrbitPay - Support Chat Screen
// ============================================================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';
import { ChatService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import { timeAgo } from '../../utils/formatters';
import type { RootStackParamList, ChatMessage } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Support'>;
};

const QUICK_REPLIES = [
  'I need help with a transfer',
  'My card is not working',
  'I want to dispute a transaction',
  'I forgot my PIN',
  'How do I verify my account?',
];

const BOT_RESPONSES: Record<string, string> = {
  default: 'Thank you for contacting OrbitPay support. A specialist will be with you shortly. Average wait time: 2 minutes.',
  'transfer': 'I can help with transfers. Please provide the transaction reference number and I\'ll look into it right away.',
  'card':     'I\'ll escalate your card issue immediately. In the meantime, you can freeze your card from the Cards tab for security.',
  'dispute':  'To dispute a transaction, I need the transaction date, amount, and merchant name. Could you provide those details?',
  'pin':      'For PIN reset, I\'ll send a verification code to your registered phone number. Would you like to proceed?',
  'verify':   'Account verification requires a government-issued ID and a selfie. Navigate to Profile > KYC Verification to get started.',
};

const ChatBubble: React.FC<{
  message: ChatMessage;
  isUser: boolean;
}> = ({ message, isUser }) => (
  <View style={[styles.bubbleWrapper, isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperSupport]}>
    {!isUser && (
      <View style={styles.supportAvatar}>
        <Text style={styles.supportAvatarText}>🌐</Text>
      </View>
    )}
    <View style={[
      styles.bubble,
      isUser ? styles.bubbleUser : styles.bubbleSupport,
    ]}>
      {!isUser && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextSupport]}>
        {message.content}
      </Text>
      <Text style={[styles.bubbleTime, isUser ? { color: 'rgba(255,255,255,0.6)' } : undefined]}>
        {timeAgo(message.createdAt)}
      </Text>
    </View>
  </View>
);

const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const { user, chatMessages, setChatMessages, appendChatMessage, darkMode } = useAppStore();
  const [input, setInput] = useState('');
  const [roomId] = useState('support_1');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const messages = chatMessages[roomId] ?? [];

  const initRoom = useCallback(async () => {
    try {
      const msgs = await ChatService.getMessages(roomId);
      setChatMessages(roomId, msgs);
    } catch {
      // Seed with a welcome message
      const welcome: ChatMessage = {
        id:          'bot_welcome',
        roomId,
        senderId:    'bot',
        senderType:  'support',
        senderName:  'OrbitPay Support',
        content:     'Welcome to OrbitPay Support! How can we help you today? 👋',
        isRead:      true,
        createdAt:   new Date().toISOString(),
      };
      setChatMessages(roomId, [welcome]);
    }
  }, [roomId]);

  useEffect(() => { initRoom(); }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput('');
    setShowQuickReplies(false);

    const userMsg: ChatMessage = {
      id:         `msg_${Date.now()}`,
      roomId,
      senderId:   user?.id ?? 'u1',
      senderType: 'user',
      senderName: user?.fullName ?? 'You',
      content,
      isRead:     true,
      createdAt:  new Date().toISOString(),
    };
    appendChatMessage(roomId, userMsg);

    // Auto-reply
    setTimeout(() => {
      const key = Object.keys(BOT_RESPONSES).find(k => k !== 'default' && content.toLowerCase().includes(k)) ?? 'default';
      const botMsg: ChatMessage = {
        id:         `bot_${Date.now()}`,
        roomId,
        senderId:   'support',
        senderType: 'support',
        senderName: 'OrbitPay Support',
        content:    BOT_RESPONSES[key],
        isRead:     true,
        createdAt:  new Date().toISOString(),
      };
      appendChatMessage(roomId, botMsg);
    }, 1200);

    try {
      await ChatService.sendMessage(roomId, content);
    } catch {}
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>🌐</Text>
          </View>
          <View>
            <Text style={styles.headerName}>OrbitPay Support</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online · Avg. 2 min reply</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Message list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isUser={item.senderType === 'user'}
            />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>Today</Text>
            </View>
          }
        />

        {/* Quick replies */}
        {showQuickReplies && messages.length <= 2 && (
          <View style={[styles.quickReplies, darkMode && styles.quickRepliesDark]}>
            <Text style={[styles.quickRepliesTitle, darkMode && { color: COLORS.gray[300] }]}>Quick questions</Text>
            <View style={styles.quickRepliesRow}>
              {QUICK_REPLIES.map((reply) => (
                <TouchableOpacity
                  key={reply}
                  onPress={() => sendMessage(reply)}
                  style={styles.quickReplyBtn}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input area */}
        <View style={[styles.inputArea, darkMode && styles.inputAreaDark]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, darkMode && styles.textInputDark]}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray[400]}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!input.trim()}
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          >
            <LinearGradient
              colors={input.trim() ? [COLORS.primary[500], COLORS.teal[600]] : [COLORS.gray[300], COLORS.gray[300]]}
              style={styles.sendBtnGradient}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F0FDF4' },
  containerDark: { backgroundColor: COLORS.gray[900] },
  header: {
    paddingTop:    60,
    paddingBottom: SPACING[4],
    paddingHorizontal: SPACING[5],
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  backBtn:      { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:     { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING[3] },
  headerAvatar: {
    width:          44,
    height:         44,
    borderRadius:   22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    2,
    borderColor:    'rgba(255,255,255,0.4)',
  },
  headerAvatarText: { fontSize: 22 },
  headerName: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.white },
  onlineRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  onlineText: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.75)' },
  chatContainer: { flex: 1 },
  messageList:   { padding: SPACING[4], paddingBottom: SPACING[3] },
  dateHeader: {
    alignItems:    'center',
    marginBottom:  SPACING[4],
  },
  dateHeaderText: {
    fontSize:      FONT_SIZES.xs,
    color:         COLORS.gray[400],
    backgroundColor: COLORS.gray[100],
    paddingVertical:   4,
    paddingHorizontal: SPACING[3],
    borderRadius:  RADIUS.full,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    marginBottom:  SPACING[3],
    gap:           SPACING[2],
  },
  bubbleWrapperUser:    { flexDirection: 'row-reverse' },
  bubbleWrapperSupport: {},
  supportAvatar: {
    width:          32,
    height:         32,
    borderRadius:   16,
    backgroundColor: COLORS.primary[100],
    alignItems:     'center',
    justifyContent: 'center',
  },
  supportAvatarText: { fontSize: 16 },
  bubble: {
    maxWidth:     '75%',
    borderRadius: RADIUS.xl,
    padding:      SPACING[3],
  },
  bubbleUser: {
    backgroundColor: COLORS.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleSupport: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 1 },
    shadowOpacity:  0.05,
    shadowRadius:   2,
    elevation:      2,
  },
  senderName: {
    fontSize:     FONT_SIZES.xs,
    fontWeight:   '700',
    color:        COLORS.primary[600],
    marginBottom: 4,
  },
  bubbleText:        { fontSize: FONT_SIZES.base, lineHeight: 22 },
  bubbleTextUser:    { color: COLORS.white },
  bubbleTextSupport: { color: COLORS.gray[800] },
  bubbleTime:        { fontSize: 10, color: COLORS.gray[400], marginTop: 4, textAlign: 'right' },
  quickReplies: {
    backgroundColor: COLORS.white,
    padding:         SPACING[4],
    borderTopWidth:  1,
    borderTopColor:  COLORS.gray[100],
  },
  quickRepliesDark: { backgroundColor: COLORS.gray[800], borderTopColor: COLORS.gray[700] },
  quickRepliesTitle: {
    fontSize:     FONT_SIZES.xs,
    fontWeight:   '600',
    color:        COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING[2],
  },
  quickRepliesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING[2] },
  quickReplyBtn: {
    backgroundColor: COLORS.primary[50],
    borderRadius:    RADIUS.full,
    paddingVertical:   SPACING[2],
    paddingHorizontal: SPACING[3],
    borderWidth:       1,
    borderColor:       COLORS.primary[200],
  },
  quickReplyText: { fontSize: FONT_SIZES.xs, color: COLORS.primary[700], fontWeight: '500' },
  inputArea: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    padding:        SPACING[3],
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    gap:            SPACING[2],
  },
  inputAreaDark: { backgroundColor: COLORS.gray[800], borderTopColor: COLORS.gray[700] },
  attachBtn: {
    width:          40,
    height:         40,
    borderRadius:   20,
    backgroundColor: COLORS.gray[100],
    alignItems:     'center',
    justifyContent: 'center',
  },
  attachIcon: { fontSize: 18 },
  textInput: {
    flex:            1,
    maxHeight:       120,
    backgroundColor: COLORS.gray[100],
    borderRadius:    RADIUS.xl,
    paddingVertical:   SPACING[3],
    paddingHorizontal: SPACING[4],
    fontSize:        FONT_SIZES.base,
    color:           COLORS.gray[800],
    lineHeight:      22,
  },
  textInputDark: { backgroundColor: COLORS.gray[700], color: COLORS.white },
  sendBtn:       { flexShrink: 0 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnGradient: {
    width:          40,
    height:         40,
    borderRadius:   20,
    alignItems:     'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 18, color: COLORS.white, fontWeight: '700' },
});

export default SupportScreen;
