import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const teamMembers = [
  {
    id: 1,
    name: 'Lê Văn Nam',
    role: 'ĐỘI TRƯỞNG',
    status: 'busy', // busy, available
    skills: ['Chỉ huy', 'Cứu nạn'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuyHJht1Ui_YnTJY1DSTJcepL41z4IZMSumUIurIVYz9lef0hO7-k_3uGKOnurRxgL8dyP3uXt8LLnxj0am06PnWSIY2rEbTIWwBVHMyaX-Ubx2HcV_jmPv0vWeY7QjH7wnnbSuvmdF3a96wV66E8_Xkkm4SJzfiy5u8pZsR7Jg1GT1YRXxBBTCjsOtcNX1pL-AlsMP3II1iJxEO0E1UYqEpwzWTj6UZeSCvlEbrTbzEdxkZ8BFHsX9mCnN-_TbKVl9lw6NXuuRBM',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    role: 'THÀNH VIÊN',
    status: 'busy',
    skills: ['Cứu hộ thủy', 'Sơ cấp cứu'],
    initials: 'NB',
    color: '#3b82f6',
  },
  {
    id: 3,
    name: 'Trần Thị C',
    role: 'THÀNH VIÊN',
    status: 'available',
    skills: ['Tâm lý', 'Hậu cần'],
    initials: 'TC',
    color: '#8b5cf6',
  },
  {
    id: 4,
    name: 'Lê Văn D',
    role: 'THÀNH VIÊN',
    status: 'busy',
    skills: ['Lái xe', 'Kỹ thuật'],
    initials: 'LD',
    color: '#f59e0b',
  },
  {
    id: 5,
    name: 'Hoàng Văn K',
    role: 'THÀNH VIÊN',
    status: 'available',
    skills: ['Viễn thông', 'Trinh sát'],
    initials: 'HK',
    color: '#14b8a6',
  },
  {
    id: 6,
    name: 'Nguyễn Thành P',
    role: 'TỶ TRƯỞNG',
    status: 'available',
    skills: ['Tình nguyện'],
    initials: 'NP',
    color: '#6b7280',
  },
];

export default function TeamMembersScreen({ navigation }) {
  const totalMembers = teamMembers.length;
  const readyMembers = teamMembers.filter(m => m.status === 'available').length;
  const onDuty = teamMembers.filter(m => m.status === 'busy').length;

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberCard}
      activeOpacity={0.7}
    >
      <View style={styles.memberContent}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
        ) : (
          <View style={[styles.memberAvatarInitials, { backgroundColor: item.color }]}>
            <Text style={styles.memberInitials}>{item.initials}</Text>
          </View>
        )}
        <View style={[styles.memberStatusDot, { backgroundColor: item.status === 'available' ? '#28A745' : '#FF8C00' }]} />
        
        <View style={styles.memberInfo}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberName}>{item.name}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>{item.role}</Text>
            </View>
          </View>
          
          <View style={styles.memberSkills}>
            {item.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overview Section */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewHeader}>
            <Text style={styles.sectionLabel}>TỔNG QUAN</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Trực tuyến</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tổng quân số</Text>
              <Text style={styles.statValue}>{totalMembers}</Text>
              <Text style={{ fontSize: 40, color: '#e5e7eb', marginTop: 8 }}>👥</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Sẵn sàng</Text>
              <Text style={[styles.statValue, { color: '#28A745' }]}>{String(readyMembers).padStart(2, '0')}</Text>
              <Text style={{ fontSize: 40, color: '#dcfce7', marginTop: 8 }}>✓</Text>
            </View>
          </View>

          {/* On Duty Badge */}
          <View style={styles.onDutyBadge}>
            <View style={styles.onDutyContent}>
              <View style={styles.onDutyIcon}>
                <Text style={{ fontSize: 18 }}>🚨</Text>
              </View>
              <View>
                <Text style={styles.onDutyLabel}>Đang làm nhiệm vụ</Text>
                <View style={styles.onDutyValue}>
                  <Text style={styles.onDutyNumber}>{onDuty}</Text>
                  <Text style={styles.onDutyUnit}>chiến sĩ</Text>
                </View>
              </View>
            </View>
            <View style={styles.onDutyMission}>
              <Text style={styles.missionCodeLabel}>Mã vụ việc</Text>
              <Text style={styles.missionCode}>#RE-9921</Text>
            </View>
          </View>
        </View>

        {/* Team Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.sectionTitle}>Thành viên đội</Text>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>Lọc danh sách</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={teamMembers}
            renderItem={renderMemberItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.memberList}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 20 }}>📋</Text>
          <Text style={styles.navLabel}>Nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={{ fontSize: 20 }}>👥</Text>
          <Text style={styles.navLabelActive}>Thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 20 }}>📜</Text>
          <Text style={styles.navLabel}>Lịch sử</Text>
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
  overviewSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#999',
    letterSpacing: 0.5,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    backgroundColor: '#28A745',
    borderRadius: 3,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#28A745',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#999',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    marginTop: 8,
  },
  onDutyBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  onDutyContent: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  onDutyIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onDutyLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF8C00',
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onDutyValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  onDutyNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  onDutyUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
  },
  onDutyMission: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  missionCodeLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
  },
  missionCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4277a9',
    marginTop: 2,
  },
  membersSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4277a9',
  },
  memberList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  memberContent: {
    flexDirection: 'row',
    gap: 12,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
  },
  memberAvatarInitials: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  memberInitials: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  memberStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#fff',
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  memberBadge: {
    backgroundColor: 'rgba(66, 119, 169, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(66, 119, 169, 0.2)',
  },
  memberBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4277a9',
  },
  memberSkills: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
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
    opacity: 1,
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
