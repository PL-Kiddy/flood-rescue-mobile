import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { getMockRescueRequests, updateMockRescueRequest } from '../../data/mockData';

export default function ConfirmRescueScreen({ navigation, route }) {
  const { requestId } = route?.params || {};
  const requests = getMockRescueRequests();
  const request = requests.find((r) => r.id === requestId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

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

  const handleSubmit = () => {
    updateMockRescueRequest(requestId, {
      confirmed_by_citizen: true,
      citizen_feedback: { rating, comment: comment.trim() || null },
    });
    Alert.alert('Cảm ơn bạn!', 'Xác nhận và phản hồi của bạn đã được ghi nhận.', [
      { text: 'OK', onPress: () => navigation.navigate('RequestDetail', { requestId }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đã được hỗ trợ</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.intro}>
          Yêu cầu {request.code} đã được xử lý. Bạn xác nhận đã được cứu hộ / đã nhận cứu trợ và có thể gửi phản hồi để giúp chúng tôi cải thiện.
        </Text>

        <Text style={styles.label}>Đánh giá (1–5 sao)</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setRating(n)}
              style={styles.starBtn}
            >
              <Ionicons
                name={n <= rating ? 'star' : 'star-outline'}
                size={36}
                color={colors.warning}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Phản hồi (tùy chọn)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ghi chú về chất lượng, thời gian phản hồi..."
          placeholderTextColor={colors.gray500}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={22} color={colors.white} />
          <Text style={styles.submitBtnText}>Gửi xác nhận & phản hồi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  intro: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  starBtn: { padding: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: colors.white },
};
