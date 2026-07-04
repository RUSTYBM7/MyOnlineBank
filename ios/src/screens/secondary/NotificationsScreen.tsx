// ============================================================
// OrbitPay - Notifications Screen
// ============================================================
import React, { useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SectionList, TouchableOpacity,
  RefreshControl, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';
import { GradientButton, EmptyState } from '../../components/common/UIComponents';
import { NotificationService } from '../../services/apiServices';
import { useAppStore, useUnreadCount } from '../../store';
import { timeAgo } from '../../utils/formatters';
import type { RootStackParamList, AppNotification } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

const NOTIFICATION_ICONS: Record<string, string> = {
  transaction: '💸',
  security:    '🛡️',
  chat:        '💬',
  kyc:         '🪪',
  system:      '⚙️',
  promo:       '🎉',
};

const NOTIFICATION_COLORS: Record<string, string> = {
  transaction: COLORS.primary[500],
  security:    COLORS.error,
  chat:        COLORS.teal[500],
  kyc:         COLORS.warning,
  system:      COLORS.gray[500],
  promo:       '#8B5CF6',
};

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  darkMode: boolean;
}
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress, darkMode }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.notifItem, !notification.read && styles.notifUnread, darkMode && styles.notifItemDark]}
  >
    <View style={[
      styles.notifIconBg,
      { backgroundColor: `${NOTIFICATION_COLORS[notification.type]}20` },
    ]}>
      <Text style={styles.notifIcon}>{NOTIFICATION_ICONS[notification.type] ?? '🔔'}</Text>
    </View>
    <View style={styles.notifContent}>
      <Text style={[styles.notifTitle, darkMode && { color: COLORS.white }, !notification.read && styles.notifTitleUnread]}>
        {notification.title}
      </Text>
      <Text style={[styles.notifMessage, darkMode && { color: COLORS.gray[400] }]} numberOfLines={2}>
        {notification.message}
      </Text>
      <Text style={styles.notifTime}>{timeAgo(notification.createdAt)}</Text>
    </View>
    {!notification.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead, darkMode } = useAppStore();
  const unreadCount = useUnreadCount();
  const [refreshing, setRefreshing] = React.useState(false);

  const load = useCallback(async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch { /* use store */ }
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleMarkRead = async (id: string) => {
    markNotificationRead(id);
    try { await NotificationService.markRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    markAllNotificationsRead();
    try { await NotificationService.markAllRead(); } catch {}
  };

  // Group notifications by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const grouped = notifications.reduce<{
    today: AppNotification[];
    yesterday: AppNotification[];
    older: AppNotification[];
  }>((acc, n) => {
    const d = new Date(n.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) acc.today.push(n);
    else if (d.getTime() === yesterday.getTime()) acc.yesterday.push(n);
    else acc.older.push(n);
    return acc;
  }, { today: [], yesterday: [], older: [] });

  const sections = [
    { title: 'Today',     data: grouped.today },
    { title: 'Yesterday', data: grouped.yesterday },
    { title: 'Earlier',   data: grouped.older },
  ].filter(s => s.data.length > 0);

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 80 }} />}
      </LinearGradient>

      {notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          message="You're all caught up! We'll notify you of account activity here."
          icon={<Text style={{ fontSize: 56 }}>🔔</Text>}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={() => handleMarkRead(item.id)}
              darkMode={darkMode}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.sectionHeader, darkMode && styles.sectionHeaderDark]}>
              <Text style={[styles.sectionTitle, darkMode && { color: COLORS.gray[400] }]}>
                {title}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary[500]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, darkMode && { backgroundColor: COLORS.gray[800] }]} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark: { backgroundColor: COLORS.gray[900] },
  header: {
    paddingTop:    60,
    paddingBottom: SPACING[4],
    paddingHorizontal: SPACING[5],
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  backBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:   { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
  headerSub:   { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  markAllBtn:  { paddingVertical: SPACING[2], paddingHorizontal: SPACING[3] },
  markAllText: { fontSize: FONT_SIZES.sm, color: COLORS.white, fontWeight: '500', textDecorationLine: 'underline' },
  listContent: { paddingBottom: 100 },
  sectionHeader: {
    backgroundColor:  COLORS.gray[50],
    paddingVertical:  SPACING[2],
    paddingHorizontal: SPACING[5],
  },
  sectionHeaderDark: { backgroundColor: COLORS.gray[900] },
  sectionTitle: {
    fontSize:   FONT_SIZES.xs,
    fontWeight: '700',
    color:      COLORS.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notifItem: {
    flexDirection:    'row',
    alignItems:       'flex-start',
    paddingVertical:  SPACING[4],
    paddingHorizontal: SPACING[5],
    backgroundColor:  COLORS.white,
    gap:              SPACING[3],
  },
  notifItemDark: { backgroundColor: COLORS.gray[800] },
  notifUnread:   { backgroundColor: COLORS.primary[50] },
  notifIconBg: {
    width:          48,
    height:         48,
    borderRadius:   RADIUS.lg,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  notifIcon:        { fontSize: 22 },
  notifContent:     { flex: 1 },
  notifTitle: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '500',
    color:      COLORS.gray[800],
    marginBottom: 2,
  },
  notifTitleUnread: { fontWeight: '700' },
  notifMessage:     { fontSize: FONT_SIZES.sm, color: COLORS.gray[500], lineHeight: 20 },
  notifTime:        { fontSize: FONT_SIZES.xs, color: COLORS.gray[400], marginTop: 4 },
  unreadDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: COLORS.primary[500],
    marginTop:       SPACING[1],
    flexShrink:      0,
  },
  separator: { height: 1, backgroundColor: COLORS.gray[100] },
});

export default NotificationsScreen;
