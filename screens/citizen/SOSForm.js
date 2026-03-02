import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { REQUEST_CATEGORY, PRIORITY_LEVELS } from '../../data/mockData';
import { getCurrentLocationWithFallback } from '../../utils/location';
import { useAuth } from '../../contexts/AuthContext';
import { createRescueRequest } from '../../services/rescueRequests';

export default function SOSForm({ navigation }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province_city: '',
    address: '',
    location: { lat: 21.0285, lng: 105.8542 },
    description: '',
    num_people: 1,
    priority: 'high',
    images: [],
  });

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const result = await getCurrentLocationWithFallback();
      setFormData((prev) => ({
        ...prev,
        location: { lat: result.lat, lng: result.lng },
      }));
      const msg = result.isFromCache
        ? `Đã dùng vị trí gần đây (có thể kém chính xác): ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`
        : `Đã lấy vị trí: ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`;
      Alert.alert('Thành công', msg);
    } catch (err) {
      const message =
        err.message === 'PERMISSION_DENIED'
          ? 'Ứng dụng cần quyền vị trí để gửi tọa độ khi cần cứu hộ. Vui lòng bật trong Cài đặt.'
          : err.message === 'LOCATION_SERVICES_OFF'
          ? 'Vui lòng bật dịch vụ vị trí (GPS) trong Cài đặt thiết bị.'
          : err.message === 'TIMEOUT' || (err.message && err.message.includes('timeout'))
          ? 'Không lấy được vị trí kịp thời. Hãy đảm bảo GPS bật, ra chỗ thoáng và thử lại.'
          : err.message || 'Vui lòng bật GPS và thử lại.';
      Alert.alert('Không lấy được vị trí', message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      category: REQUEST_CATEGORY.RESCUE,
      phone_number: formData.phone,
      province_city: formData.province_city || 'Chưa chọn',
      address: formData.address,
      location_type: formData.address ? 'manual' : 'gps',
      location: formData.location,
      latitude: formData.location?.lat,
      longitude: formData.location?.lng,
      description: formData.description,
      num_people: formData.num_people || 1,
      priority: formData.priority || 'high',
      media_urls: formData.images?.length ? formData.images : [],
    };
    try {
      const created = await createRescueRequest(payload);
      const code = created?.code || created?.id ? `#${String(created.id).slice(0, 8)}` : '';
      Alert.alert('Thành công', `Yêu cầu SOS đã được gửi!${code ? ` Mã: ${code}` : ''}`, [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (err) {
      const msg = err?.message || err?.data?.message || 'Gửi yêu cầu thất bại. Kiểm tra kết nối và thử lại.';
      Alert.alert('Lỗi', msg);
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / 3) * 100}%`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Thông tin liên hệ</Text>
              </View>

              <View style={styles.inputGroup}>
                <View>
                  <Text style={styles.label}>Họ và tên</Text>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="Nhập họ tên..."
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                  />
                </View>

                <View>
                  <Text style={styles.label}>Số điện thoại</Text>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="09xxxxxxxxx"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone: text })
                    }
                  />
                </View>

                <View>
                  <Text style={styles.label}>Tỉnh / Thành phố</Text>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="VD: Cần Thơ, TP. Hồ Chí Minh..."
                    value={formData.province_city}
                    onChangeText={(text) =>
                      setFormData({ ...formData, province_city: text })
                    }
                  />
                </View>

                <View>
                  <Text style={styles.label}>Số người gặp nạn</Text>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="1"
                    keyboardType="number-pad"
                    value={String(formData.num_people)}
                    onChangeText={(text) =>
                      setFormData({ ...formData, num_people: parseInt(text, 10) || 1 })
                    }
                  />
                </View>

                <View>
                  <Text style={styles.label}>Mức độ ưu tiên</Text>
                  <View style={styles.priorityRow}>
                    {PRIORITY_LEVELS.map((p) => (
                      <TouchableOpacity
                        key={p.value}
                        style={[
                          styles.priorityChip,
                          formData.priority === p.value && styles.priorityChipActive,
                        ]}
                        onPress={() => setFormData({ ...formData, priority: p.value })}
                      >
                        <Text style={[
                          styles.priorityChipText,
                          formData.priority === p.value && styles.priorityChipTextActive,
                        ]}>{p.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Vị trí của bạn</Text>
              </View>

              <TouchableOpacity
                style={styles.autoLocationBtn}
                onPress={handleGetCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Ionicons name="locate" size={20} color={colors.primary} />
                )}
                <Text style={styles.autoLocationText}>
                  {locationLoading ? 'Đang lấy vị trí...' : 'LẤY VỊ TRÍ TỰ ĐỘNG'}
                </Text>
              </TouchableOpacity>

              <View>
                <Text style={styles.label}>Địa chỉ cụ thể (nếu có)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Số nhà, thôn, xóm..."
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />
              </View>

              <View style={styles.mapContainer}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDafCwO7PLh_lfW9GUq2yApm6tHdVUZcOXXrjc8hdtjiYtyzvyt3RraNVJMaoiQFREVrJubRlUUeXXewymy54RpjqiLXwQWnLY8dnmI52MHWFIJzfsDN8lfGedE01zWp-mZBetx0CZrv94a9-e0mQS-J7VAORu38dRig9FE7Nemqhp3bUEh19abvdKHctEoVP9jRnyfH6zWosvNMK_sb-F7hhnZbpKI9sCVinzFhGmZGIiqmUfpvKDuXE4-pLlkksu8ISehRb4bqqQ',
                  }}
                  style={styles.mapImage}
                />
                <View style={styles.locationPinContainer}>
                  <Ionicons
                    name="location"
                    size={48}
                    color={colors.sos}
                  />
                </View>
                <View style={styles.mapLabel}>
                  <Text style={styles.mapLabelText}>Xem bản đồ lớn</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Tình trạng khẩn cấp</Text>
              </View>

              <View>
                <Text style={styles.label}>Mô tả ngắn gọn</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Nước dâng cao, kẹt trên mái..."
                  multiline
                  numberOfLines={5}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                />
              </View>

              <TouchableOpacity style={styles.photoBtn}>
                <View style={styles.photoBtnIcon}>
                  <Ionicons name="camera" size={26} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.photoBtnTitle}>Chụp ảnh / Tải lên</Text>
                  <Text style={styles.photoBtnSubtitle}>
                    Giúp cứu hộ xác định vị trí
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIcon}>
            <Ionicons name="alert-circle" size={18} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>SOS Khẩn Cấp</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabel}>
          <Text style={styles.progressLabelText}>Tiến trình</Text>
          <Text style={styles.progressPercent}>Bước {currentStep}/3</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 3) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            currentStep === 1 && styles.navBtnDisabled,
          ]}
          onPress={handlePrevStep}
          disabled={currentStep === 1}
        >
          <Ionicons name="arrow-back" size={20} color={currentStep === 1 ? colors.gray400 : colors.primary} />
          <Text style={[styles.navBtnText, currentStep === 1 && styles.navBtnTextDisabled]}>
            Trước
          </Text>
        </TouchableOpacity>

        {currentStep < 3 ? (
          <TouchableOpacity
            style={styles.navBtn}
            onPress={handleNextStep}
          >
            <Text style={styles.navBtnText}>Tiếp</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtn, styles.submitBtn]}
            onPress={handleSubmit}
          >
            <Ionicons name="send" size={20} color={colors.white} />
            <Text style={[styles.navBtnText, styles.submitBtnText]}>
              GỬI YÊU CẦU
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 28,
    height: 28,
    backgroundColor: colors.sos,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.sos,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepSection: {
    gap: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  inputGroup: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginBottom: 8,
  },
  largeInput: {
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  autoLocationBtn: {
    height: 56,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  autoLocationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mapContainer: {
    height: 160,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  locationPinContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mapLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fafafa',
    gap: 12,
  },
  photoBtnIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoBtnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  photoBtnSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.gray300,
    backgroundColor: colors.surface,
  },
  priorityChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  priorityChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray600,
  },
  priorityChipTextActive: {
    color: colors.primary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  navBtnDisabled: {
    opacity: 0.5,
    borderColor: '#ddd',
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  navBtnTextDisabled: {
    color: '#ccc',
  },
  submitBtn: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  submitBtnText: {
    color: colors.white,
  },
};
