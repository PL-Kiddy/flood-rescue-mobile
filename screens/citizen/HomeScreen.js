import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { getCurrentLocationWithFallback } from '../../utils/location';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_REGION = {
  latitude: 21.0285,
  longitude: 105.8542,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const MARKER_OFFSETS = {
  sos: { latitude: 0.002, longitude: 0.003 },
  safe: { latitude: 0.004, longitude: 0.002 },
  team: { latitude: -0.001, longitude: 0.002 },
};

export default function HomeScreen({ navigation, route }) {
  const { user, logout: authLogout } = useAuth();
  const isCitizenLoggedIn = !!user && (user.role === 'user' || !user.role);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (route?.params?.citizenLoggedIn !== undefined) {
      // Refresh from auth context
    }
  }, [route?.params?.citizenLoggedIn]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLocationLoading(true);
      setLocationError(false);
      try {
        const result = await getCurrentLocationWithFallback();
        if (cancelled) return;
        setUserLocation({ latitude: result.lat, longitude: result.lng });
        setRegion({
          latitude: result.lat,
          longitude: result.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch (_) {
        if (!cancelled) {
          setLocationError(true);
          setUserLocation(null);
        }
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!userLocation || !mapRef.current || Platform.OS === 'web') return;
    const r = { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 };
    mapRef.current.animateToRegion(r, 600);
  }, [userLocation?.latitude, userLocation?.longitude]);

  const handleLogout = () => {
    setAvatarMenuVisible(false);
    authLogout();
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 400);
    } else {
      // Không có vị trí: thử lấy lại hoặc về vùng mặc định
      retryLocation();
    }
  };

  const retryLocation = () => {
    setLocationLoading(true);
    setLocationError(false);
    (async () => {
      try {
        const result = await getCurrentLocationWithFallback();
        setUserLocation({ latitude: result.lat, longitude: result.lng });
        setRegion({
          latitude: result.lat,
          longitude: result.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch (_) {
        setLocationError(true);
        setUserLocation(null);
      } finally {
        setLocationLoading(false);
      }
    })();
  };

  const zoomIn = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: Math.max(0.002, region.latitudeDelta / 2),
        longitudeDelta: Math.max(0.002, region.longitudeDelta / 2),
      }, 300);
    }
  };

  const zoomOut = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: Math.min(2, region.latitudeDelta * 2),
        longitudeDelta: Math.min(2, region.longitudeDelta * 2),
      }, 300);
    }
  };

  const base = userLocation || { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude };
  const markerCoords = {
    sos: { latitude: base.latitude + MARKER_OFFSETS.sos.latitude, longitude: base.longitude + MARKER_OFFSETS.sos.longitude },
    safe: { latitude: base.latitude + MARKER_OFFSETS.safe.latitude, longitude: base.longitude + MARKER_OFFSETS.safe.longitude },
    team: { latitude: base.latitude + MARKER_OFFSETS.team.latitude, longitude: base.longitude + MARKER_OFFSETS.team.longitude },
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.mapContainer}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSMU__1goqEb5IefkHjv2LR-gq3VwDm1Viz7GBnyEfVxys7wRix6v0erXtycJkPzAOtQaJiMZZgYcqe48JdAIf338xRalh8-woqIfBXJl1K5YRPA8fJl7e9RzHjq1up9gGHUPF7nfSSp81L_el1xwqVQ6HopD97Jax1DmFJg7yJuFrG0Zoz9ydausaJ-PwxqgAIhdBFzffP2-mQ_aSOQiudFLk5HJd_0KzSDRo0NJ1409q7nrhFWAvLwhBOUBaC5qt1C45q_EROVg' }} style={styles.mapImage} />
          <View style={styles.mapOverlay} />
          {locationLoading && <View style={styles.mapLoading}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.mapLoadingText}>Đang lấy vị trí...</Text></View>}
          {locationError && <View style={styles.mapLoading}><Ionicons name="locate-outline" size={32} color={colors.gray500} /><Text style={styles.mapLoadingText}>Không lấy được vị trí. Bật GPS và thử lại.</Text></View>}
        </View>
      );
    }
    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.mapImage}
          initialRegion={DEFAULT_REGION}
          onRegionChangeComplete={(r) => setRegion(r)}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
          loadingEnabled={locationLoading}
        >
          <Marker coordinate={markerCoords.sos} title="Khẩn cấp: Nước dâng" pinColor={colors.sos} />
          <Marker coordinate={markerCoords.safe} title="Trường THCS Hòa Bình" pinColor={colors.success} />
          <Marker coordinate={markerCoords.team} title="Đội cứu hộ #05" pinColor={colors.primary} />
        </MapView>
        {locationLoading && (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.mapLoadingText}>Đang lấy vị trí...</Text>
          </View>
        )}
        {locationError && !locationLoading && (
          <View style={styles.locationErrorBanner}>
            <Ionicons name="locate-outline" size={20} color={colors.gray600} />
            <Text style={styles.locationErrorText}>Không lấy được vị trí. Bật GPS hoặc thử lại.</Text>
            <TouchableOpacity style={styles.retryLocationBtn} onPress={retryLocation}>
              <Text style={styles.retryLocationText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Map */}
      {renderMap()}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>CỨU TRỢ THIÊN TAI</Text>
            <Text style={styles.headerSubtitle}>Dành cho người dân</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.gray600} />
            </TouchableOpacity>
            {isCitizenLoggedIn ? (
              <TouchableOpacity onPress={() => setAvatarMenuVisible(true)} style={styles.avatarTouch}>
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tF_1eIvvrD83eWRAoe-3d96B0aXaXs0jqAWxqyswKI8LBiqyVvXHOnhHzw7Lo0qP_mmp2JQP3ThRBAd0GohkAV439UpMYlBTQbLcWRY3WSY9C2s9jILWHGFq-ZDjSsiagrlYlpzMYlzr6tn60wG23atqijkSQSWYuGpd0_vlJ47riljO8rivoPHnrBImgTd_4MZ8AKU-xUIEDckE7iwA8Y3sEa_Fpguo4ZwL_MDTXnAITVBYEaXXfxKQb098GdXmTcTnamZUeU0' }} style={styles.avatar} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginBtnText}>Đăng nhập</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Avatar menu modal */}
      <Modal visible={avatarMenuVisible} transparent animationType="fade">
        <Pressable style={styles.menuOverlay} onPress={() => setAvatarMenuVisible(false)}>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setAvatarMenuVisible(false); navigation.navigate('Profile'); }}>
              <Text style={styles.menuItemText}>Xem profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: colors.sos }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

        <View style={styles.mapControls}>
        <View style={styles.zoomGroup}>
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
            <Ionicons name="add" size={22} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
            <Ionicons name="remove" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.locationBtn} onPress={centerOnUser}>
          <Ionicons name="locate" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomHandle} />
        <View style={styles.bottomHeader}>
          <Text style={styles.bottomHeaderText}>Tình hình khu vực</Text>
        </View>
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>Cảnh báo lũ cấp 3 tại khu vực của bạn</Text>
        </View>

        <ScrollView style={styles.bottomContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[styles.actionBtn, styles.myRequestsBtn]} onPress={() => navigation.navigate('MyRequests')}>
            <View style={styles.actionIconBox}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Yêu cầu của tôi</Text>
              <Text style={[styles.actionSubtitle, { color: colors.gray600 }]}>Theo dõi trạng thái yêu cầu đã gửi</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.sosBtn]} onPress={() => navigation.navigate('SOSForm')}>
            <View style={styles.actionIconBox}>
              <Ionicons name="alert-circle" size={26} color={colors.white} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Gửi Cứu Hộ SOS</Text>
              <Text style={styles.actionSubtitle}>Tôi đang gặp nguy hiểm</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.reliefBtn]} onPress={() => navigation.navigate('ReliefForm')}>
            <View style={styles.actionIconBox}>
              <Ionicons name="cube" size={26} color={colors.white} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Yêu cầu Nhu Yếu Phẩm</Text>
              <Text style={styles.actionSubtitle}>Lương thực, Thuốc men, Áo phao</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryLight,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mapLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
  locationErrorBanner: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  locationErrorText: {
    flex: 1,
    fontSize: 12,
    color: colors.gray600,
  },
  retryLocationBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryLocationText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  markerGroup: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerSOS: {
    top: '45%',
    left: '30%',
  },
  radarPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(211, 47, 47, 0.35)',
  },
  sosMarker: {
    backgroundColor: colors.sos,
    padding: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerIcon: {},
  markerLabel: {
    marginTop: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1f2937',
  },
  markerSafe: {
    top: '25%',
    left: '65%',
  },
  safeMarker: {
    backgroundColor: colors.success,
    padding: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerIconSmall: {},
  safeLabel: {
    marginTop: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  safeLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  markerTeam: {
    top: '50%',
    left: '60%',
  },
  teamMarker: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  teamLabel: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  teamLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  currentLocation: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 82, 186, 0.2)',
    position: 'absolute',
  },
  locationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.gray600,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  avatarTouch: {
    padding: 2,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: 12,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: '36%',
    alignItems: 'flex-end',
    gap: 12,
  },
  zoomGroup: {
    width: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  zoomBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  zoomIcon: {},
  locationBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  locationIcon: {},
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  bottomHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#6b7280',
    letterSpacing: 1,
  },
  bottomHeaderIcon: {},
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  warningIcon: {},
  warningText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b91c1c',
    flex: 1,
  },
  bottomContent: {
    maxHeight: 220,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  sosBtn: {
    backgroundColor: colors.sos,
  },
  reliefBtn: {
    backgroundColor: colors.relief,
  },
  myRequestsBtn: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {},
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#fff',
  },
  actionSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  actionChevron: {},
});
