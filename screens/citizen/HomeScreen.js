import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mockRescueRequests, emergencyNumbers } from '../../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={{fontSize: 18}}>🌊</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>CỨU TRỢ THIÊN TAI</Text>
              <Text style={styles.headerSubtitle}>Dành cho người dân</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginBtnText}>🔐 ĐỘI CỨU HỘ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBtn}>
              <MaterialIcons name="notifications" size={24} color="#666" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tF_1eIvvrD83eWRAoe-3d96B0aXaXs0jqAWxqyswKI8LBiqyVvXHOnhHzw7Lo0qP_mmp2JQP3ThRBAd0GohkAV439UpMYlBTQbLcWRY3WSY9C2s9jILWHGFq-ZDjSsiagrlYlpzMYlzr6tn60wG23atqijkSQSWYuGpd0_vlJ47riljO8rivoPHnrBImgTd_4MZ8AKU-xUIEDckE7iwA8Y3sEa_Fpguo4ZwL_MDTXnAITVBYEaXXfxKQb098GdXmTcTnamZUeU0',
              }}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSMU__1goqEb5IefkHjv2LR-gq3VwDm1Viz7GBnyEfVxys7wRix6v0erXtycJkPzAOtQaJiMZZgYcqe48JdAIf338xRalh8-woqIfBXJl1K5YRPA8fJl7e9RzHjq1up9gGHUPF7nfSSp81L_el1xwqVQ6HopD97Jax1DmFJg7yJuFrG0Zoz9ydausaJ-PwxqgAIhdBFzffP2-mQ_aSOQiudFLk5HJd_0KzSDRo0NJ1409q7nrhFWAvLwhBOUBaC5qt1C45q_EROVg',
          }}
          style={styles.mapImage}
        />
        <View style={styles.mapOverlay} />

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.zoomBtn}>
            <MaterialIcons name="add" size={24} color="#0F52BA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn}>
            <MaterialIcons name="remove" size={24} color="#0F52BA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationBtn}>
            <Text style={{fontSize: 18}}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        
        <ScrollView
          style={{ maxHeight: 250 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheetContent}>
            {/* Warning Banner */}
            <View style={styles.warningBanner}>
              <MaterialIcons name="warning" size={18} color="#d32f2f" />
              <Text style={styles.warningText}>
                Cảnh báo lũ cấp 3 tại khu vực của bạn
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.sosBtn]}
              onPress={() => navigation.navigate('SOSForm')}
            >
              <View style={styles.actionBtnIcon}>
                <Text style={{fontSize: 28}}>🆘</Text>
              </View>
              <View style={styles.actionBtnContent}>
                <Text style={styles.actionBtnTitle}>Gửi Cứu Hộ SOS</Text>
                <Text style={styles.actionBtnSubtitle}>Tôi đang gặp nguy hiểm</Text>
              </View>
              <Text style={{fontSize: 20}}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.reliefBtn]}
              onPress={() => navigation.navigate('ReliefForm')}
            >
              <View style={styles.actionBtnIcon}>
                <Text style={{fontSize: 28}}>📦</Text>
              </View>
              <View style={styles.actionBtnContent}>
                <Text style={styles.actionBtnTitle}>Yêu cầu Nhu Yếu Phẩm</Text>
                <Text style={styles.actionBtnSubtitle}>Lương thực, Thuốc men, Áo phao</Text>
              </View>
              <Text style={{fontSize: 20}}>›</Text>
            </TouchableOpacity>

            {/* Emergency Numbers */}
            <View style={styles.emergencySection}>
              <Text style={styles.emergencyTitle}>Liên hệ khẩn cấp</Text>
              <View style={styles.emergencyNumbers}>
                {emergencyNumbers.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.emergencyNumber}
                    onPress={() => {}}
                  >
                    <Text style={styles.emergencyIcon}>{item.icon}</Text>
                    <Text style={styles.emergencyNumberText}>{item.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    backgroundColor: '#d32f2f',
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
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: '#4277a9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loginBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#d32f2f',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(30, 60, 114, 0.1)',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 280,
    gap: 12,
  },
  zoomBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#d0d0d0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetContent: {
    paddingBottom: 16,
  },
  warningBanner: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  warningText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginLeft: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 12,
  },
  sosBtn: {
    backgroundColor: '#d32f2f',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reliefBtn: {
    backgroundColor: '#f57c00',
    shadowColor: '#f57c00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(4px)',
  },
  actionBtnContent: {
    flex: 1,
  },
  actionBtnTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    lineHeight: 18,
  },
  actionBtnSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  emergencySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  emergencyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  emergencyNumber: {
    alignItems: 'center',
    gap: 4,
  },
  emergencyIcon: {
    fontSize: 24,
  },
  emergencyNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
};
