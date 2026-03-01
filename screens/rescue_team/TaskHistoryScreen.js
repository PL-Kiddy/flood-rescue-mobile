import React, { useState } from 'react';
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

const taskHistory = [
  {
    id: 1,
    code: '#RE-9920',
    victim: 'Trần Thị B',
    status: 'Đã sơ tán',
    statusColor: '#28A745',
    datetime: '10/10/2023 - 14:30',
    location: '45 Nguyễn Huệ, Quận 1',
    team: 'Team-A1',
  },
  {
    id: 2,
    code: '#RE-9918',
    victim: 'Lê Văn C',
    status: 'Cấp cứu tại chỗ',
    statusColor: '#FF8C00',
    datetime: '10/10/2023 - 11:15',
    location: 'Hẻm 203 XVNT, Bình Thạnh',
    team: 'Team-A1',
  },
  {
    id: 3,
    code: '#RE-9892',
    victim: 'Gia đình anh Nam',
    status: 'Đã sơ tán',
    statusColor: '#28A745',
    datetime: '09/10/2023 - 22:45',
    location: 'Khu dân cư Thanh Đa, Bình Thạnh',
    team: 'Team-A1',
  },
  {
    id: 4,
    code: '#RE-9885',
    victim: 'Nguyễn Văn K',
    status: 'Chuyển viện',
    statusColor: '#dc2626',
    datetime: '09/10/2023 - 19:20',
    location: 'Cầu Sài Gòn (Chân cầu)',
    team: 'Team-A1',
  },
  {
    id: 5,
    code: '#RE-9850',
    victim: 'Cụ bà H\'Hen',
    status: 'Đã sơ tán',
    statusColor: '#28A745',
    datetime: '09/10/2023 - 08:10',
    location: 'Chung cư cũ, P.27, Bình Thạnh',
    team: 'Team-A1',
  },
];

const statsData = [
  { id: 1, label: 'Tổng nhiệm vụ', value: '124', icon: 'document-text', color: colors.primary },
  { id: 2, label: 'Người đã cứu', value: '318', icon: 'checkmark-circle', color: colors.success },
  { id: 3, label: 'Giờ hoạt động', value: '860h', icon: 'time', color: colors.relief },
  { id: 4, label: 'Sơ cứu tại chỗ', value: '42', icon: 'medkit', color: colors.sos },
];

export default function TaskHistoryScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

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
            data={taskHistory}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
