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
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { reliefCategories, emergencyNumbers } from '../../data/mockData';

const { width } = Dimensions.get('window');

export default function ReliefForm({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedItems: [],
    description: '',
    images: [],
  });

  const toggleCategory = (categoryId) => {
    const updated = formData.selectedItems.includes(categoryId)
      ? formData.selectedItems.filter(id => id !== categoryId)
      : [...formData.selectedItems, categoryId];
    setFormData({ ...formData, selectedItems: updated });
  };

  const handleSubmit = () => {
    // TODO: Submit form
    alert('Yêu cầu đã được gửi!');
    navigation.goBack();
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
          <MaterialIcons name="check" size={16} color="#fff" />
        )}
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 20}}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <View style={styles.headerIcon}>
            <Text style={{fontSize: 16}}>📦</Text>
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
              <MaterialIcons
                name="badge"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
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
              <MaterialIcons
                name="call"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
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

          <TouchableOpacity style={styles.autoLocationBtn}>
            <Text style={{fontSize: 16}}>📍</Text>
            <Text style={styles.autoLocationText}>TỰ ĐỘNG XÁC VỊ</Text>
          </TouchableOpacity>

          <View style={styles.mapPreview}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDafCwO7PLh_lfW9GUq2yApm6tHdVUZcOXXrjc8hdtjiYtyzvyt3RraNVJMaoiQFREVrJubRlUUeXXewymy54RpjqiLXwQWnLY8dnmI52MHWFIJzfsDN8lfGedE01zWp-mZBetx0CZrv94a9-e0mQS-J7VAORu38dRig9FE7Nemqhp3bUEh19abvdKHctEoVP9jRnyfH6zWosvNMK_sb-F7hhnZbpKI9sCVinzFhGmZGIiqmUfpvKDuXE4-pLlkksu8ISehRb4bqqQ',
              }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <View style={styles.mapOverlayContent}>
              <Text style={{fontSize: 14}}>👆</Text>
                <Text style={styles.mapOverlayText}>Ghim trên bản đồ</Text>
              </View>
            </View>
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
            <Text style={{fontSize: 32}}>📷</Text>
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
                <Text style={{fontSize: 14}}>📞</Text>
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
    backgroundColor: '#f97316',
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
    color: '#f97316',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
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
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f97316',
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
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
    gap: 8,
  },
  autoLocationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f97316',
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
    resizeMode: 'cover',
    opacity: 0.6,
  },
  mapOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapOverlayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
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
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
    borderColor: '#f97316',
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
    backgroundColor: '#f97316',
    borderColor: '#f97316',
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
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(249, 115, 22, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
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
