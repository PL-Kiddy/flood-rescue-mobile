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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function TaskHistoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Tổng nhiệm vụ', value: '124', icon: '✓', color: '#3b82f6', bgColor: '#eff6ff' },
    { label: 'Người đã cứu', value: '318', icon: '👤', color: '#28A745', bgColor: '#f0fdf4' },
    { label: 'Giờ hoạt động', value: '860h', icon: '⏱️', color: '#f59e0b', bgColor: '#fffbeb' },
    { label: 'Sơ cứu tại chỗ', value: '42', icon: '🩺', color: '#dc2626', bgColor: '#fef2f2' },
  ];

  const renderStatCard = ({ item }) => (
    <View style={[styles.statCard, { backgroundColor: item.bgColor }]}>
      <View style={[styles.statIconBox, { backgroundColor: 'rgba(' + parseInt(item.color.slice(1,3), 16) + ',' + parseInt(item.color.slice(3,5), 16) + ',' + parseInt(item.color.slice(5,7), 16) + ',0.2)' }]}>
        <Text style={{ fontSize: 24 }}>{item.icon}</Text>
      </View>
      <View>
        <Text style={styles.statValue}>{item.value}</Text>
        <Text style={styles.statLabel}>{item.label}</Text>
      </View>
    </View>
  );

  const renderTaskCard = ({ item }) => (
    <TouchableOpacity style={styles.taskCard} activeOpacity={0.7}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskCode}>{item.code}</Text>
        <View style={[styles.taskStatusBadge, { backgroundColor: item.statusColor + '20', borderColor: item.statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: item.statusColor }]} />
          <Text style={[styles.taskStatus, { color: item.statusColor }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.taskVictim}>{item.victim}</Text>

      <View style={styles.taskDetails}>
        <View style={styles.taskDetail}>
          <Text style={{ fontSize: 14 }}>📅</Text>
          <Text style={styles.taskDetailText}>{item.datetime}</Text>
        </View>
        <View style={styles.taskDetail}>
          <Text style={{ fontSize: 14 }}>📍</Text>
          <Text style={styles.taskDetailText} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <Text style={styles.taskTeam}>Đội hỗ trợ: {item.team}</Text>
        <TouchableOpacity>
          <View style={styles.viewDetailBtn}>
            <Text style={styles.viewDetailText}>Xem chi tiết</Text>
            <Text style={{ fontSize: 14 }}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 20 }}>🚨</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>CỨU HỘ VN</Text>
            <Text style={styles.headerSubtitle}>Team Alpha-1</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Stats Carousel */}
        <View style={styles.statsSection}>
          <FlatList
            data={stats}
            renderItem={renderStatCard}
            keyExtractor={(item) => item.label}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsCarousel}
            scrollEventThrottle={16}
          />
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo mã, tên..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Task History */}
        <View style={styles.tasksSection}>
          <FlatList
            data={taskHistory}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.taskList}
          />
          
          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.spinner} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 20 }}>📋</Text>
          <Text style={styles.navLabel}>Nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 20 }}>👥</Text>
          <Text style={styles.navLabel}>Thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <View style={styles.navActiveIndicator} />
          <Text style={{ fontSize: 20 }}>📜</Text>
          <Text style={styles.navLabelActive}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 20 }}>👤</Text>
          <Text style={styles.navLabel}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 2,
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 6,
    height: 6,
    backgroundColor: '#dc2626',
    borderRadius: 3,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  statsSection: {
    paddingTop: 16,
  },
  statsCarousel: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: 144,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 10,
  },
  filterBtn: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tasksSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  taskList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#fff',
    backgroundColor: '#4277a9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  taskStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  taskStatus: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  taskVictim: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  taskDetails: {
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12,
    gap: 8,
    marginBottom: 12,
  },
  taskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskDetailText: {
    fontSize: 12,
    color: '#666',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  taskTeam: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4277a9',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderTopColor: '#4277a9',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navItemActive: {
    position: 'relative',
  },
  navActiveIndicator: {
    position: 'absolute',
    top: -8,
    width: 40,
    height: 3,
    backgroundColor: '#4277a9',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4277a9',
  },
};
