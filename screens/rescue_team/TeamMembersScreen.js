import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

const mockMembers = [
  {
    id: '1',
    name: 'Lê Văn Nam',
    initials: 'LN',
    role: 'ĐỘI TRƯỞNG',
    status: 'active',
    skills: ['Chỉ huy', 'Cứu nạn'],
    badge: 'ĐỘI TRƯỞNG',
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'Nguyễn Văn B',
    initials: 'NB',
    role: 'Cứu hộ thủy',
    status: 'active',
    skills: ['Cứu hộ thủy', 'Sơ cấp cứu'],
    color: '#3b82f6',
  },
  {
    id: '3',
    name: 'Trần Thị C',
    initials: 'TC',
    role: 'Hỗ trợ',
    status: 'idle',
    skills: ['Tâm lý', 'Hậu cần'],
    color: '#a855f7',
  },
  {
    id: '4',
    name: 'Lê Văn D',
    initials: 'LD',
    role: 'Lái xe',
    status: 'active',
    skills: ['Lái xe', 'Kỹ thuật'],
    color: '#eab308',
  },
  {
    id: '5',
    name: 'Hoàng Văn K',
    initials: 'HK',
    role: 'Viễn thông',
    status: 'idle',
    skills: ['Viễn thông', 'Trinh sát'],
    color: '#14b8a6',
  },
  {
    id: '6',
    name: 'Nguyễn Thành P',
    initials: 'NP',
    role: 'Tình nguyện',
    status: 'idle',
    skills: ['Tình nguyện'],
    color: '#6b7280',
  },
];

export default function TeamMembersScreen({ navigation }) {
  const totalMembers = mockMembers.length;
  const readyMembers = mockMembers.filter((m) => m.status === 'active').length;
  const onDutyMembers = mockMembers.filter((m) => m.status === 'active').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#FF8C00';
      case 'idle':
        return '#28A745';
      default:
        return '#999';
    }
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={styles.memberCard}
      activeOpacity={0.8}
    >
      <View style={styles.memberContainer}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: item.color }]}>
          <Text style={styles.avatarText}>{item.initials}</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
        </View>

        {/* Member Info */}
        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>{item.name}</Text>
            {item.badge && (
              <Text style={styles.badge}>{item.badge}</Text>
            )}
          </View>

          {/* Skills */}
          <View style={styles.skillsRow}>
            {item.skills.map((skill, idx) => (
              <Text key={idx} style={styles.skillBadge}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="alert-circle" size={22} color={colors.white} />
            </View>
            <View>
              <Text style={styles.headerTitle}>CỨU HỘ VN</Text>
              <Text style={styles.headerSubtitle}>Team Alpha-1</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.gray400} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={20} color={colors.gray600} />
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Tổng quan</Text>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Trực tuyến</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard}>
              <Text style={styles.statLabel}>Tổng quân số</Text>
              <Text style={styles.statValue}>{totalMembers}</Text>
              <Ionicons name="people" size={32} color={colors.gray700} style={styles.statIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard}>
              <Text style={styles.statLabel}>Sẵn sàng</Text>
              <Text style={styles.statValueGreen}>{readyMembers}</Text>
              <Ionicons name="checkmark-circle" size={32} color={colors.success} style={styles.statIcon} />
            </TouchableOpacity>
          </View>

          {/* On Duty Card */}
          <View style={styles.onDutyCard}>
            <View style={styles.onDutyLeft}>
              <View style={styles.onDutyIcon}>
                <Ionicons name="alert-circle" size={20} color={colors.relief} />
              </View>
              <View>
                <Text style={styles.onDutyLabel}>Đang làm nhiệm vụ</Text>
                <View style={styles.onDutyValue}>
                  <Text style={styles.onDutyNumber}>{onDutyMembers}</Text>
                  <Text style={styles.onDutyUnit}>chiến sĩ</Text>
                </View>
              </View>
            </View>
            <View style={styles.onDutyRight}>
              <Text style={styles.missionCodeLabel}>Mã vụ việc</Text>
              <Text style={styles.missionCode}>#RE-9921</Text>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersTitle}>Thành viên đội</Text>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>Lọc danh sách</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />

          <TouchableOpacity style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>Xem thêm 6 thành viên</Text>
          </TouchableOpacity>
        </View>
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
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate('TeamMembers')}
        >
          <Ionicons name="people" size={22} color={colors.primary} />
          <Text style={styles.navLabelActive}>Thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TaskHistory')}
        >
          <Ionicons name="time" size={22} color={colors.gray500} />
          <Text style={styles.navLabel}>Lịch sử</Text>
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
    backgroundColor: '#121212',
  },
  scrollView: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#4277a9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    width: 10,
    height: 10,
    backgroundColor: '#dc2626',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#e5e7eb',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  summarySection: {
    padding: 16,
    gap: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: '#28A745',
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#28A745',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  statValueGreen: {
    fontSize: 32,
    fontWeight: '900',
    color: '#28A745',
    marginBottom: 8,
  },
  statIcon: {
    opacity: 0.3,
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  onDutyCard: {
    backgroundColor: 'rgba(255, 140, 0, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onDutyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  onDutyIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onDutyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8C00',
    textTransform: 'uppercase',
  },
  onDutyValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  onDutyNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  onDutyUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
  },
  onDutyRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  missionCodeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  missionCode: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4277a9',
  },
  membersSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4277a9',
  },
  memberCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1e1e1e',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  badge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4277a9',
    backgroundColor: 'rgba(66, 119, 169, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4277a9',
  },
  skillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  skillBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    backgroundColor: '#2d3748',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewMoreBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#374151',
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
