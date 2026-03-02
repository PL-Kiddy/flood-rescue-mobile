import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { REQUEST_STATUS_LABEL, REQUEST_CATEGORY_LABEL } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { getRescueRequests } from '../../services/rescueRequests';

function normalizeItem(item) {
  return {
    ...item,
    code: item.code || `#${(item.id || '').slice(0, 8)}`,
    category: item.category || 'rescue',
    status: item.status || 'new',
    address: item.address || '',
    province_city: item.province_city || '',
    created_at: item.created_at,
  };
}

export default function MyRequestsScreen({ navigation }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRescueRequests({ user_id: user?.id });
        if (!cancelled) setRequests((res.data || []).map(normalizeItem));
      } catch (err) {
        if (!cancelled) {
          setRequests([]);
          setError(err?.message || err?.data?.message || 'Không tải được danh sách. Kiểm tra kết nối.');
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return colors.warning;
      case 'pending_verification': return colors.info;
      case 'on_mission': return colors.primary;
      case 'completed': return colors.success;
      case 'rejected': return colors.sos;
      default: return colors.gray600;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.code}>{item.code}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{REQUEST_STATUS_LABEL[item.status] || item.status}</Text>
        </View>
      </View>
      <Text style={styles.category}>{REQUEST_CATEGORY_LABEL[item.category] || item.category}</Text>
      {item.description ? <Text style={styles.description} numberOfLines={2}>{item.description}</Text> : null}
      <View style={styles.meta}>
        <Text style={styles.metaText} numberOfLines={1}>{item.address || item.province_city || '—'}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : '—'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yêu cầu của tôi</Text>
        <View style={styles.backBtn} />
      </View>
      {loading ? (
        <View style={styles.empty}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Lỗi tải dữ liệu</Text>
          <Text style={styles.emptySubtext}>{error}</Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có yêu cầu nào</Text>
          <Text style={styles.emptySubtext}>Gửi SOS hoặc yêu cầu nhu yếu phẩm từ màn chính</Text>
        </View>
      ) : (
        <FlatList data={requests} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={styles.separator} />} />
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  list: { padding: 16, paddingBottom: 32 },
  separator: { height: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.gray200 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  code: { fontSize: 14, fontWeight: '800', color: colors.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  category: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 6 },
  description: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  meta: { marginTop: 4 },
  metaText: { fontSize: 12, color: colors.gray600 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.gray600, marginTop: 16 },
  emptySubtext: { fontSize: 13, color: colors.gray500, marginTop: 8, textAlign: 'center' },
};
