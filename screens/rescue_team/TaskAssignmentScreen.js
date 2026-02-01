import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskAssignmentScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStatusUpdate = (status) => {
    // Handle status update
    alert(`Status updated to: ${status}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 18 }}>🚨</Text>
          </View>
          <Text style={styles.headerTitle}>CỨU HỘ VN</Text>
        </View>
        <View style={styles.activeMission}>
          <View style={styles.activeDot} />
          <Text style={styles.activeMissionCode}>#RE-9921</Text>
        </View>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuyHJht1Ui_YnTJY1DSTJcepL41z4IZMSumUIurIVYz9lef0hO7-k_3uGKOnurRxgL8dyP3uXt8LLnxj0am06PnWSIY2rEbTIWwBVHMyaX-Ubx2HcV_jmPv0vWeY7QjH7wnnbSuvmdF3a96wV66E8_Xkkm4SJzfiy5u8pZsR7Jg1GT1YRXxBBTCjsOtcNX1pL-AlsMP3II1iJxEO0E1UYqEpwzWTj6UZeSCvlEbrTbzEdxkZ8BFHsX9mCnN-_TbKVl9lw6NXuuRBM' }}
          style={styles.avatar}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapSection}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqsK5_7Vc18hUsLgo-3VX5DbLnuwZPf9azv3cTD2FliDfLyxFfdnrBjjWEsOLALQ4YJEpBxzs25_s3Y7-QJO951TAMsKosAyc77QSXYawg1XwcFSXjoI-mLbefxByCLxQ--UL5hB9zS7tetR6EnUki2QhIznRDFm39OTme-ajQZeJ2t-lRsUTGMI3A8wR28iescpGhCi0xvNxcopHFs5lDxbDWooKArxdxrGDyuDLiY-F2x6Rco_J6VoKvES0R-r43ymIAUyiYKZk' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay} />
          
          {/* Distance Info */}
          <View style={styles.distanceBox}>
            <Text style={{ fontSize: 12 }}>📍 Khoảng cách</Text>
            <View style={styles.distanceValue}>
              <Text style={{ fontSize: 20 }}>🛣️</Text>
              <Text style={styles.distanceText}>1.2 km</Text>
            </View>
          </View>

          {/* Navigation Button */}
          <TouchableOpacity style={styles.navButton}>
            <Text style={{ fontSize: 16 }}>📍</Text>
            <View>
              <Text style={styles.navButtonText}>Dẫn đường</Text>
            </View>
            <Text style={{ fontSize: 18 }}>›</Text>
          </TouchableOpacity>

          {/* Route Path SVG Simulation */}
          <View style={styles.routePath} />
        </View>

        {/* Task Details */}
        <View style={styles.detailsCard}>
          <View style={styles.victimSection}>
            <View>
              <Text style={styles.detailLabel}>Nạn nhân</Text>
              <Text style={styles.victimName}>Nguyễn Văn An</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={{ fontSize: 18 }}>📞</Text>
            </TouchableOpacity>
          </View>

          {/* Special Notes */}
          <View style={styles.specialNotes}>
            <Text style={styles.specialNotesIcon}>📝</Text>
            <View>
              <Text style={styles.specialNotesLabel}>Ghi chú đặc biệt</Text>
              <Text style={styles.specialNotesText}>
                Cụ ông 82 tuổi, đi lại khó khăn. Đang ở tầng 2, nước dâng cao.
              </Text>
            </View>
          </View>

          {/* Medical Conditions */}
          <View style={styles.conditionsRow}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>Cao huyết áp</Text>
            </View>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>Cần cáng</Text>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.locationSection}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Địa chỉ cứu hộ</Text>
                <Text style={styles.locationText}>
                  123 Đường Lê Lợi, Phường Bến Thành, Quận 1
                </Text>
              </View>
            </View>
          </View>

          {/* Activity Log */}
          <View style={styles.activityLog}>
            <Text style={styles.activityLogTitle}>Nhật ký hoạt động</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineMarker} />
                <View>
                  <Text style={styles.timelineTitle}>Đội xuất phát</Text>
                  <Text style={styles.timelineTime}>10:42 - Team Alpha-1</Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineMarker, styles.timelineMarkerInactive]} />
                <View>
                  <Text style={[styles.timelineTitle, styles.timelineTextInactive]}>Nhận tin báo</Text>
                  <Text style={styles.timelineTime}>10:30 - Từ tổng đài</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Status Buttons */}
      <View style={styles.statusButtonsContainer}>
        <View style={styles.statusButtonsGrid}>
          <TouchableOpacity style={[styles.statusBtn, styles.statusBtnMoving]}>
            <Text style={{ fontSize: 20 }}>🚗</Text>
            <Text style={styles.statusBtnLabel}>Đang di chuyển</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusBtn, styles.statusBtnArrived]}>
            <Text style={{ fontSize: 20 }}>📍</Text>
            <Text style={styles.statusBtnLabel}>Đã đến nơi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusBtn, styles.statusBtnCompleted]}
            onPress={() => handleStatusUpdate('Completed')}
          >
            <Text style={{ fontSize: 20 }}>✓</Text>
            <Text style={styles.statusBtnLabelCompleted}>Hoàn thành</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={{ fontSize: 18 }}>📋</Text>
          <Text style={styles.navLabelActive}>Nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 18 }}>🗺️</Text>
          <Text style={styles.navLabel}>Bản đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 18 }}>📜</Text>
          <Text style={styles.navLabel}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 18 }}>👤</Text>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    backgroundColor: '#4277a9',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  activeMission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#dc2626',
    borderRadius: 3,
  },
  activeMissionCode: {
    fontSize: 10,
    fontWeight: '900',
    color: '#dc2626',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  mapSection: {
    height: 320,
    position: 'relative',
    backgroundColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  distanceBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  distanceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  navButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  routePath: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  victimSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  victimName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  callBtn: {
    backgroundColor: '#28A745',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#28A745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  specialNotes: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 10,
  },
  specialNotesIcon: {
    fontSize: 18,
  },
  specialNotesLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#d97706',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  specialNotesText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 18,
  },
  conditionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  conditionBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  conditionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  locationSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  locationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 16,
  },
  activityLog: {
    marginTop: 16,
  },
  activityLogTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    position: 'relative',
  },
  timelineMarker: {
    position: 'absolute',
    left: -14,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelineMarkerInactive: {
    backgroundColor: '#d1d5db',
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  timelineTextInactive: {
    color: '#999',
  },
  timelineTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  statusButtonsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 72,
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  statusBtnMoving: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  statusBtnArrived: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  statusBtnCompleted: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  statusBtnLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'center',
  },
  statusBtnLabelCompleted: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
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
