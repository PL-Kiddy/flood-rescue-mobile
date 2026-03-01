import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import {
  getMockRescueRequests,
  REQUEST_STATUS_LABEL,
  REQUEST_CATEGORY_LABEL,
  REQUEST_STATUS,
} from '../../data/mockData';
import { getRescueRequestById } from '../../services/rescueRequests';

export default function RequestDetailScreen({ navigation, route }) {
  const { requestId } = route?.params || {};
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(!!requestId);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getRescueRequestById(requestId);
        if (!cancelled) setRequest(normalizeRequest(data));
      } catch (_) {
        const list = getMockRescueRequests();
        const found = list.find((r) => r.id === requestId);
        if (!cancelled) setRequest(found || null);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [requestId]);

  function normalizeRequest(r) {
    if (!r) return null;
    return {
      ...r,
      code: r.code || `#${(r.id || '').slice(0, 8)}`,
      contact_name: r.contact_name || r.creator?.username || '—',
      phone_number: r.phone_number || '',
      assigned_team: r.assigned_team || r.assigned_team_id,
    };
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.notFound}>Không tìm thấy yêu cầu.</Text>
      </SafeAreaView>
    );
  }

  const canConfirm = request.status === REQUEST_STATUS.COMPLETED && !request.confirmed_by_citizen;
  const statusColor = {
    new: colors.warning,
    pending_verification: colors.info,
    on_mission: colors.primary,
    completed: colors.success,
    rejected: colors.sos,
  }[request.status] || colors.gray600;

  const callPhone = () => {
    if (request.phone_number) Linking.openURL(`tel:${request.phone_number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.code}>{request.code}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {REQUEST_STATUS_LABEL[request.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.category}>{REQUEST_CATEGORY_LABEL[request.category]}</Text>
          <View style={styles.line} />
          <Row label="Người liên hệ" value={request.contact_name || '—'} />
          <Row label="Số điện thoại" value={request.phone_number || '—'} onPress={callPhone} />
          <Row label="Địa điểm" value={request.address || request.province_city || '—'} />
          <Row label="Số người" value={String(request.num_people || 1)} />
          <Row label="Mức ưu tiên" value={request.priority || '—'} />
          {request.description ? (
            <>
              <View style={styles.line} />
              <Text style={styles.label}>Mô tả tình huống</Text>
              <Text style={styles.description}>{request.description}</Text>
            </>
          ) : null}
          {request.assigned_team && (
            <>
              <View style={styles.line} />
              <Text style={styles.label}>Đội thực hiện</Text>
              <Text style={styles.value}>{typeof request.assigned_team === 'object' ? request.assigned_team.name : '—'}</Text>
            </>
          )}
          {request.completion_notes && (
            <>
              <View style={styles.line} />
              <Text style={styles.label}>Ghi chú hoàn thành</Text>
              <Text style={styles.description}>{request.completion_notes}</Text>
            </>
          )}
          <View style={styles.line} />
          <Text style={styles.meta}>
            Tạo lúc: {request.created_at ? new Date(request.created_at).toLocaleString('vi-VN') : '—'}
          </Text>
        </View>

        {canConfirm && (
          <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.navigate('ConfirmRescue', { requestId: request.id })}>
            <Text style={styles.confirmBtnText}>Xác nhận đã được cứu / đã nhận cứu trợ</Text>
          </TouchableOpacity>
        )}
        {request.confirmed_by_citizen && request.citizen_feedback && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Đã xác nhận & phản hồi</Text>
            {request.citizen_feedback.rating != null && (
              <Text style={styles.feedbackRating}>Đánh giá: {request.citizen_feedback.rating}/5</Text>
            )}
            {request.citizen_feedback.comment ? (
              <Text style={styles.feedbackComment}>{request.citizen_feedback.comment}</Text>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ICON_MAP = { person: 'person', phone: 'call', place: 'location', people: 'people', flag: 'flag' };
function Row({ icon, label, value, onPress }) {
  return (
    <View style={styles.rowItem}>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
          <Text style={[styles.value, onPress && styles.link]} numberOfLines={2}>{value}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  notFound: { padding: 16, fontSize: 15, color: colors.gray600 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  code: { fontSize: 16, fontWeight: '800', color: colors.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  category: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 12 },
  line: { height: 1, backgroundColor: colors.gray200, marginVertical: 12 },
  rowItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  rowContent: { flex: 1 },
  label: { fontSize: 12, color: colors.gray600, marginBottom: 2 },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
  link: { color: colors.primary },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  meta: { fontSize: 12, color: colors.gray500 },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  confirmBtnText: { fontSize: 15, fontWeight: '800', color: colors.white },
  feedbackCard: {
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.success,
  },
  feedbackTitle: { fontSize: 14, fontWeight: '800', color: colors.success, marginBottom: 8 },
  feedbackRating: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  feedbackComment: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' },
};
