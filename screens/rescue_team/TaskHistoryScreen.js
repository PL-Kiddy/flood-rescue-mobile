import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { getRescueRequests } from '../../services/rescueRequests';

function mapRequestToHistoryItem(r) {
  const code = r.code || (r.id ? `#${String(r.id).slice(0, 8)}` : '');
  const victim = r.contact_name || r.creator?.username || '—';
  const status = r.completion_notes ? 'Đã hoàn thành' : (r.status === 'completed' ? 'Đã sơ tán' : 'Đã hoàn thành');
  const statusColor = status === 'Đã sơ tán' || status === 'Đã hoàn thành' ? '#28A745' : '#666';
  const datetime = r.updated_at || r.created_at ? new Date(r.updated_at || r.created_at).toLocaleString('vi-VN') : '—';
  const location = r.address || r.province_city || '—';
  const team = typeof r.assigned_team === 'object' && r.assigned_team?.name ? r.assigned_team.name : 'Đội cứu hộ';
  return { id: r.id, code, victim, status, statusColor, datetime, location, team };
}

const statsData = [
  { id: 1, label: 'Tổng nhiệm vụ', value: '124', icon: 'document-text', color: colors.primary },
  { id: 2, label: 'Người đã cứu', value: '318', icon: 'checkmark-circle', color: colors.success },
  { id: 3, label: 'Giờ hoạt động', value: '860h', icon: 'time', color: colors.relief },
  { id: 4, label: 'Sơ cứu tại chỗ', value: '42', icon: 'medkit', color: colors.sos },
];

export default function TaskHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const teamId = user?.team_id ?? user?.rescue_team_id ?? null;
  const [taskHistory, setTaskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getRescueRequests({ assigned_team_id: teamId });
        const completed = (res.data || []).filter((r) => r.status === 'completed');
        const list = completed.map(mapRequestToHistoryItem);
        if (!cancelled) setTaskHistory(list);
      } catch (_) {
        if (!cancelled) setTaskHistory([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [teamId]);

  const filteredHistory = searchText.trim()
    ? taskHistory.filter(
        (item) =>
          item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.victim?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchText.toLowerCase())
      )
    : taskHistory;

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Đã sơ tán':
        return 'rgba(40, 167, 69, 0.1)';
      case 'Cấp cứu tại chỗ':
        return 'rgba(255, 140, 0, 0.1)';
      case 'Chuyển viện':
        return 'rgba(220, 38, 38, 0.1)';
      default:
        return 'rgba(60, 60, 60, 0.1)';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Đã sơ tán':
        return '#15803d';
      case 'Cấp cứu tại chỗ':
        return '#b45309';
      case 'Chuyển viện':
        return '#b91c1c';
      default:
        return '#666';
    }
  };

  const renderStatCard = ({ item }) => (
    <TouchableOpacity style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderTaskCard = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskCode}>{item.code}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBgColor(item.status) },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: item.statusColor }]}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusTextColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.victimName}>{item.victim}</Text>

      <View style={styles.taskDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color={colors.gray500} />
          <Text style={styles.detailText}>{item.datetime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color={colors.gray500} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <Text style={styles.teamInfo}>Đội hỗ trợ: {item.team}</Text>
        <TouchableOpacity>
          <View style={styles.viewDetailBtn}>
            <Text style={styles.viewDetailText}>Xem chi tiết</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceDark }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surfaceDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="alert-circle" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>CỨU HỘ VN</Text>
            <Text style={styles.headerSubtitle}>Team Alpha-1</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.gray400} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Stats Carousel */}
        <View style={styles.statsSection}>
          <FlatList
            data={statsData}
            renderItem={renderStatCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={150}
            decelerationRate="fast"
            contentContainerStyle={styles.statsContent}
          />
        </View>

        {/* Search & Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.gray500} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo mã, tên..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options" size={22} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        {/* Task History List */}
        <View style={styles.tasksSection}>
          <FlatList
            data={filteredHistory}
            renderItem={renderTaskCard}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListEmptyComponent={
              loading ? null : (
                <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: colors.gray500 }}>Chưa có lịch sử nhiệm vụ hoàn thành</Text>
                </View>
              )
            }
          />
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TaskAssignment')}
        >
          <Ionicons name="document-text" size={22} color={colors.gray500} />
          <Text style={styles.navLabel}>Nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TeamMembers')}
        >
          <Ionicons name="people" size={22} color={colors.gray500} />
          <Text style={styles.navLabel}>Thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate('TaskHistory')}
        >
          <Ionicons name="time" size={22} color={colors.primary} />
          <Text style={styles.navLabelActive}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={22} color={colors.gray500} />
          <Text style={styles.navLabel}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1c1e22',
  },
  header: {
    backgroundColor: '#25282e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d4d52',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    backgroundColor: '#4277a9',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4277a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9eb1b7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#25282e',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  statsSection: {
    paddingVertical: 12,
  },
  statsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: 144,
    backgroundColor: '#25282e',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3d4d52',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 112,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9eb1b7',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: 'rgba(28, 30, 34, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#3d4d52',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25282e',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3d4d52',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#25282e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3d4d52',
  },
  tasksSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  taskCard: {
    backgroundColor: '#25282e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3d4d52',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCode: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4277a9',
    backgroundColor: 'rgba(66, 119, 169, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  victimName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  taskDetails: {
    borderLeftWidth: 2,
    borderLeftColor: '#3d4d52',
    paddingLeft: 12,
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 12,
    color: '#9eb1b7',
    flex: 1,
  },
  taskFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3d4d52',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9eb1b7',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4277a9',
  },
  loadingContainer: {
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1c1e22',
    borderTopWidth: 1,
    borderTopColor: '#3d4d52',
    height: 64,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: '#4277a9',
  },
  navIcon: {
    fontSize: 20,
  },
  navIconActive: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4277a9',
    textTransform: 'uppercase',
  },
};
