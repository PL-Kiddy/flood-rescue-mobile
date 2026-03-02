import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { MISSION_STATUS, REQUEST_STATUS, MISSION_STATUS_LABEL } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { getRescueRequests, updateRescueRequest, completeRescueRequest } from '../../services/rescueRequests';

const DEFAULT_MAP_REGION = { latitude: 10.0343, longitude: 105.7889, latitudeDelta: 0.02, longitudeDelta: 0.02 };

function normalizeTask(r) {
  if (!r) return null;
  return {
    ...r,
    code: r.code || (r.id ? `#${String(r.id).slice(0, 8)}` : '#RE-xxxx'),
    contact_name: r.contact_name ?? r.creator?.username ?? '—',
    mission_status: r.mission_status ?? MISSION_STATUS.ASSIGNED,
  };
}

export default function TaskAssignmentScreen({ navigation }) {
  const { user } = useAuth();
  const teamId = user?.team_id ?? user?.rescue_team_id ?? null;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await getRescueRequests({ assigned_team_id: teamId });
      const list = (res.data || []).map(normalizeTask);
      setTasks(list);
      const current = list.find((t) => t.mission_status !== MISSION_STATUS.DECLINED) || list[0];
      setTask(current ?? null);
    } catch (_) {
      setTasks([]);
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refreshTask = useCallback(() => {
    const updated = tasks.find((t) => t.id === task?.id);
    if (updated) setTask(updated);
    else setTask(tasks[0] ?? null);
  }, [tasks, task?.id]);

  const handleAccept = async () => {
    if (!task) return;
    setActionLoading(true);
    try {
      await updateRescueRequest(task.id, { mission_status: MISSION_STATUS.ACCEPTED });
      await fetchTasks();
      Alert.alert('Đã nhận', 'Bạn đã nhận nhiệm vụ. Bắt đầu di chuyển khi sẵn sàng.');
    } catch (err) {
      Alert.alert('Lỗi', err?.message || err?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = () => {
    if (!task) return;
    Alert.alert(
      'Từ chối nhiệm vụ',
      'Bạn có chắc muốn từ chối? (VD: hỏng phương tiện, không đủ nhân lực)',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Từ chối',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await updateRescueRequest(task.id, {
                mission_status: MISSION_STATUS.DECLINED,
                status: REQUEST_STATUS.PENDING_VERIFICATION,
              });
              await fetchTasks();
            } catch (err) {
              Alert.alert('Lỗi', err?.message || err?.data?.message || 'Cập nhật thất bại.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!task) return;
    if (newStatus === MISSION_STATUS.COMPLETED) {
      setShowCompleteModal(true);
      return;
    }
    setActionLoading(true);
    try {
      await updateRescueRequest(task.id, { mission_status: newStatus });
      await fetchTasks();
    } catch (err) {
      Alert.alert('Lỗi', err?.message || err?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteSubmit = async () => {
    if (!task) return;
    setActionLoading(true);
    try {
      try {
        await completeRescueRequest(task.id, {
          completion_notes: completionNotes.trim() || 'Đã hoàn thành nhiệm vụ.',
        });
      } catch (_) {
        await updateRescueRequest(task.id, {
          mission_status: MISSION_STATUS.COMPLETED,
          status: REQUEST_STATUS.COMPLETED,
          completion_notes: completionNotes.trim() || 'Đã hoàn thành nhiệm vụ.',
        });
      }
      setShowCompleteModal(false);
      setCompletionNotes('');
      await fetchTasks();
      Alert.alert('Hoàn thành', 'Nhiệm vụ đã được đánh dấu hoàn thành.');
    } catch (err) {
      Alert.alert('Lỗi', err?.message || err?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setActionLoading(false);
    }
  };

  const isAssigned = task?.mission_status === MISSION_STATUS.ASSIGNED;
  const canUpdateStatus = task && [MISSION_STATUS.ACCEPTED, MISSION_STATUS.IN_TRANSIT, MISSION_STATUS.ON_SITE].includes(task.mission_status);
  const isCompleted = task?.mission_status === MISSION_STATUS.COMPLETED;

  const taskCoords = task?.latitude != null && task?.longitude != null
    ? { latitude: Number(task.latitude), longitude: Number(task.longitude) }
    : null;
  const mapRegion = taskCoords
    ? { ...taskCoords, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : DEFAULT_MAP_REGION;

  const openDirections = () => {
    const lat = task?.latitude ?? mapRegion.latitude;
    const lng = task?.longitude ?? mapRegion.longitude;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>CỨU HỘ VN</Text>
        </View>
        <View style={styles.activeMission}>
          <View style={styles.activeDot} />
          <Text style={styles.activeMissionCode}>{task?.code || '#RE-xxxx'}</Text>
        </View>
        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuyHJht1Ui_YnTJY1DSTJcepL41z4IZMSumUIurIVYz9lef0hO7-k_3uGKOnurRxgL8dyP3uXt8LLnxj0am06PnWSIY2rEbTIWwBVHMyaX-Ubx2HcV_jmPv0vWeY7QjH7wnnbSuvmdF3a96wV66E8_Xkkm4SJzfiy5u8pZsR7Jg1GT1YRXxBBTCjsOtcNX1pL-AlsMP3II1iJxEO0E1UYqEpwzWTj6UZeSCvlEbrTbzEdxkZ8BFHsX9mCnN-_TbKVl9lw6NXuuRBM' }} style={styles.avatar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapSection}>
          {Platform.OS !== 'web' ? (
            <MapView style={styles.mapImage} initialRegion={mapRegion} scrollEnabled={false}>
              {taskCoords && <Marker coordinate={taskCoords} title="Vị trí cứu hộ" pinColor={colors.sos} />}
            </MapView>
          ) : (
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqsK5_7Vc18hUsLgo-3VX5DbLnuwZPf9azv3cTD2FliDfLyxFfdnrBjjWEsOLALQ4YJEpBxzs25_s3Y7-QJO951TAMsKosAyc77QSXYawg1XwcFSXjoI-mLbefxByCLxQ--UL5hB9zS7tetR6EnUki2QhIznRDFm39OTme-ajQZeJ2t-lRsUTGMI3A8wR28iescpGhCi0xvNxcopHFs5lDxbDWooKArxdxrGDyuDLiY-F2x6Rco_J6VoKvES0R-r43ymIAUyiYKZk' }} style={styles.mapImage} />
          )}
          
          <View style={styles.distanceBox}>
            <Text style={{ fontSize: 12, color: colors.gray600 }}>Khoảng cách</Text>
            <Text style={styles.distanceText}>1.2 km</Text>
          </View>

          <TouchableOpacity style={styles.navButton} onPress={openDirections}>
            <Text style={styles.navButtonText}>Dẫn đường</Text>
          </TouchableOpacity>
        </View>

        {/* Task Details */}
        <View style={styles.detailsCard}>
          <View style={styles.victimSection}>
            <View>
              <Text style={styles.detailLabel}>Nạn nhân</Text>
              <Text style={styles.victimName}>{task?.contact_name || '—'}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => task?.phone_number && Linking.openURL(`tel:${task.phone_number}`)}>
              <Ionicons name="call" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Special Notes */}
          {task?.description ? (
          <View style={styles.specialNotes}>
            <Ionicons name="document-text" size={20} color={colors.warning} />
            <View>
              <Text style={styles.specialNotesLabel}>Ghi chú đặc biệt</Text>
              <Text style={styles.specialNotesText}>{task.description}</Text>
            </View>
          </View>
          ) : null}

          {/* Medical Conditions - optional */}
          {task?.mission_status && (
          <View style={styles.conditionsRow}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{MISSION_STATUS_LABEL[task.mission_status]}</Text>
            </View>
          </View>
          )}

          {/* Location Details */}
          <View style={styles.locationSection}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Ionicons name="location" size={20} color={colors.gray600} />
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Địa chỉ cứu hộ</Text>
                <Text style={styles.locationText}>
                  {task?.address || task?.province_city || '—'}
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

      {/* Status Buttons or Accept/Decline */}
      <View style={styles.statusButtonsContainer}>
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.noTaskText, { marginTop: 12 }]}>Đang tải nhiệm vụ...</Text>
          </View>
        ) : !teamId ? (
          <Text style={styles.noTaskText}>Tài khoản chưa gắn đội cứu hộ. Liên hệ quản trị để được gán đội.</Text>
        ) : !task ? (
          <Text style={styles.noTaskText}>Không có nhiệm vụ nào được phân công.</Text>
        ) : isAssigned ? (
          <View style={styles.statusButtonsGrid}>
            <TouchableOpacity style={[styles.statusBtn, styles.statusBtnAccept]} onPress={handleAccept} disabled={actionLoading}>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              <Text style={styles.statusBtnLabel}>Nhận nhiệm vụ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusBtn, styles.statusBtnDecline]} onPress={handleDecline} disabled={actionLoading}>
              <Ionicons name="close-circle" size={22} color={colors.sos} />
              <Text style={[styles.statusBtnLabel, { color: colors.sos }]}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        ) : isCompleted ? (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.completedBadgeText}>Đã hoàn thành</Text>
            {task.completion_notes ? (
              <Text style={styles.completionNotesPreview} numberOfLines={2}>{task.completion_notes}</Text>
            ) : null}
          </View>
        ) : canUpdateStatus ? (
          <View style={styles.statusButtonsGrid}>
            <TouchableOpacity style={[styles.statusBtn, styles.statusBtnMoving]} onPress={() => handleStatusUpdate(MISSION_STATUS.IN_TRANSIT)}>
              <Ionicons name="car" size={22} color={colors.primary} />
              <Text style={styles.statusBtnLabel}>Đang di chuyển</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusBtn, styles.statusBtnArrived]} onPress={() => handleStatusUpdate(MISSION_STATUS.ON_SITE)}>
              <Ionicons name="location" size={22} color={colors.relief} />
              <Text style={styles.statusBtnLabel}>Đã đến nơi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusBtn, styles.statusBtnCompleted]}
              onPress={() => handleStatusUpdate(MISSION_STATUS.COMPLETED)}
            >
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              <Text style={styles.statusBtnLabelCompleted}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Modal visible={showCompleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Báo cáo hoàn thành</Text>
            <Text style={styles.modalSubtitle}>Số người cứu được, ghi chú, tổn thất (nếu có)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Đã sơ tán 5 người đến điểm an toàn. Không có tổn thất."
              placeholderTextColor={colors.gray500}
              value={completionNotes}
              onChangeText={setCompletionNotes}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowCompleteModal(false); setCompletionNotes(''); }}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCompleteSubmit}>
                <Text style={styles.modalSubmitText}>Gửi báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate('TaskAssignment')}
        >
          <Ionicons name="document-text" size={22} color={colors.primary} />
          <Text style={styles.navLabelActive}>Nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TeamMembers')}
        >
          <Ionicons name="people" size={22} color={colors.gray500} />
          <Text style={styles.navLabel}>Thành viên</Text>
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
    backgroundColor: colors.primary,
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
  distanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
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
    backgroundColor: colors.primary,
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
    backgroundColor: colors.success,
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
  statusBtnAccept: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  statusBtnDecline: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  completedBadgeText: { fontSize: 14, fontWeight: '800', color: colors.success },
  completionNotesPreview: { fontSize: 11, color: colors.gray600, marginTop: 4, textAlign: 'center' },
  noTaskText: { fontSize: 13, color: colors.gray600, textAlign: 'center', paddingVertical: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: colors.gray600, marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.gray400 },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: colors.gray600 },
  modalSubmitBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: colors.success },
  modalSubmitText: { fontSize: 15, fontWeight: '800', color: colors.white },
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
    borderTopColor: colors.primary,
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
    color: colors.primary,
    textTransform: 'uppercase',
  },
};
