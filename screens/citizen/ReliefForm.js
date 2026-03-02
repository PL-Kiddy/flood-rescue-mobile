import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { reliefCategories, emergencyNumbers, REQUEST_CATEGORY } from '../../data/mockData';
import { colors } from '../../constants/theme';
import { getCurrentLocationWithFallback } from '../../utils/location';
import { useAuth } from '../../contexts/AuthContext';
import { createRescueRequest } from '../../services/rescueRequests';

const { width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 21.0285,
  longitude: 105.8542,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ReliefForm({ navigation }) {
  const { user } = useAuth();
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    province_city: '',
    selectedItems: [],
    description: '',
    num_people: 1,
    images: [],
    location: null,
  });

  const toggleCategory = (categoryId) => {
    const updated = formData.selectedItems.includes(categoryId)
      ? formData.selectedItems.filter(id => id !== categoryId)
      : [...formData.selectedItems, categoryId];
    setFormData({ ...formData, selectedItems: updated });
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
          ? 'Ứng dụng cần quyền vị trí để xác định nơi cần cứu trợ. Vui lòng bật trong Cài đặt.'
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
    const selectedNames = reliefCategories
      .filter((c) => formData.selectedItems.includes(c.id))
      .map((c) => c.name)
      .join(', ');
    const fullDescription = [
      selectedNames && `Nhu cầu: ${selectedNames}.`,
      formData.description,
    ].filter(Boolean).join(' ');
    const payload = {
      category: REQUEST_CATEGORY.SUPPLIES,
      phone_number: formData.phone,
      province_city: formData.province_city || 'Chưa chọn',
      address: formData.address,
      location_type: formData.location ? 'gps' : (formData.address ? 'manual' : 'manual'),
      latitude: formData.location?.lat,
      longitude: formData.location?.lng,
      description: fullDescription || 'Cần nhu yếu phẩm',
      num_people: formData.num_people || 1,
      priority: 'medium',
    };
    try {
      await createRescueRequest(payload);
      Alert.alert('Thành công', 'Yêu cầu tiếp tế đã được gửi!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      const msg = err?.message || err?.data?.message || 'Gửi yêu cầu thất bại. Kiểm tra kết nối và thử lại.';
      Alert.alert('Lỗi', msg);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        formData.selectedItems.includes(item.id) && styles.categoryItemSelected,
      ]}
      onPress={() => toggleCategory(item.id)}
    >
      <View
        style={[
          styles.checkbox,
          formData.selectedItems.includes(item.id) && styles.checkboxSelected,
        ]}
      >
        {formData.selectedItems.includes(item.id) && (
          <Ionicons name="checkmark" size={14} color={colors.white} />
        )}
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <View style={styles.headerIcon}>
            <Ionicons name="cube" size={18} color={colors.white} />
          </View>
          <Text style={styles.headerText}>Nhu Yếu Phẩm</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabel}>
          <Text style={styles.progressText}>Tiến trình</Text>
          <Text style={styles.progressPercent}>Bước 1/5</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '20%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Section 1: Contact Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWithIcon}>
              <Ionicons name="person-circle-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Họ và tên"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>

            <View style={styles.inputWithIcon}>
              <Ionicons name="call" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />
            </View>
          </View>
        </View>

        {/* Section 2: Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Vị trí cần cứu trợ</Text>
          </View>

          <View style={styles.inputWithIcon}>
            <Ionicons name="location" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Tỉnh / Thành phố"
              value={formData.province_city}
              onChangeText={(text) => setFormData({ ...formData, province_city: text })}
            />
          </View>

          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Địa chỉ chi tiết (Số nhà, ngõ, thôn...)"
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(text) =>
              setFormData({ ...formData, address: text })
            }
          />

          <TouchableOpacity
            style={styles.autoLocationBtn}
            onPress={handleGetCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color={colors.relief} />
            ) : (
              <Ionicons name="locate" size={18} color={colors.relief} />
            )}
            <Text style={styles.autoLocationText}>
              {locationLoading ? 'Đang lấy vị trí...' : 'TỰ ĐỘNG XÁC VỊ'}
            </Text>
          </TouchableOpacity>

          <View style={styles.mapPreview}>
            {Platform.OS === 'web' ? (
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={40} color={colors.gray400} />
                <Text style={styles.mapPlaceholderText}>Bản đồ (chạy trên thiết bị để xem)</Text>
              </View>
            ) : (
              <MapView
                key={formData.location ? `${formData.location.lat}-${formData.location.lng}` : 'default'}
                style={styles.mapImage}
                initialRegion={
                  formData.location
                    ? { latitude: formData.location.lat, longitude: formData.location.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }
                    : DEFAULT_REGION
                }
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                showsUserLocation={!!formData.location}
              >
                {formData.location && (
                  <Marker
                    coordinate={{ latitude: formData.location.lat, longitude: formData.location.lng }}
                    title="Vị trí cần cứu trợ"
                    pinColor={colors.relief}
                  />
                )}
              </MapView>
            )}
          </View>
        </View>

        {/* Section 3: Relief Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Nhu yếu phẩm</Text>
          </View>

          <FlatList
            data={reliefCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryGrid}
            style={{ marginHorizontal: -6 }}
          />

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Số người / hộ cần hỗ trợ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="VD: 3"
              keyboardType="number-pad"
              value={String(formData.num_people)}
              onChangeText={(text) => setFormData({ ...formData, num_people: parseInt(text, 10) || 1 })}
            />
          </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Mô tả thêm</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ghi chú số lượng người, tình trạng đặc biệt..."
              multiline
              numberOfLines={3}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>
        </View>

        {/* Section 4: Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Ảnh hiện trạng</Text>
          </View>

          <TouchableOpacity style={styles.photoUpload}>
            <Ionicons name="camera" size={36} color={colors.gray600} />
            <Text style={styles.photoUploadText}>Tải ảnh khu vực</Text>
            <Text style={styles.photoUploadSubtext}>Tối đa 5 ảnh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>GỬI YÊU CẦU TIẾP TẾ</Text>
        </TouchableOpacity>

        <View style={styles.emergencyLinks}>
          {emergencyNumbers.map((item, index) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.emergencyLink}>
                <Ionicons name="call" size={16} color={colors.gray600} />
                <Text style={styles.emergencyLinkText}>{item.number}</Text>
              </TouchableOpacity>
              {index < emergencyNumbers.length - 1 && (
                <View style={styles.emergencyDivider} />
              )}
            </View>
          ))}
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.relief,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.relief,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray300,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.relief,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.reliefLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.relief,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  inputGroup: {
    gap: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#fafafa',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  autoLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.reliefLight,
    borderRadius: 12,
    backgroundColor: colors.reliefLight,
    gap: 8,
  },
  autoLocationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.relief,
  },
  mapPreview: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: colors.gray500,
  },
  categoryGrid: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  categoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 10,
  },
  categoryItemSelected: {
    backgroundColor: colors.reliefLight,
    borderColor: colors.relief,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: colors.relief,
    borderColor: colors.relief,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  descriptionSection: {
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
    gap: 8,
  },
  photoUploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: '#999',
  },
  bottomBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  submitBtn: {
    backgroundColor: colors.relief,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.relief,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  emergencyLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  emergencyDivider: {
    width: 4,
    height: 4,
    backgroundColor: '#999',
    borderRadius: 2,
  },
};
