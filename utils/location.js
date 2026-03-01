import { Platform } from 'react-native';
import * as Location from 'expo-location';

const LOCATION_TIMEOUT_MS = 15000;
const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000; // 5 phút

/**
 * Lấy vị trí hiện tại, tối ưu cho Android (timeout + fallback getLastKnownPosition).
 * Trả về { lat, lng, isFromCache } hoặc throw. isFromCache = true nếu dùng vị trí cache.
 */
export async function getCurrentLocationWithFallback() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) {
    throw new Error('LOCATION_SERVICES_OFF');
  }

  // Android: gợi ý bật chế độ chính xác cao (network location) để GPS ổn định hơn
  if (Platform.OS === 'android') {
    try {
      await Location.enableNetworkProviderAsync();
    } catch (_) {
      // Bỏ qua nếu user từ chối hoặc không hỗ trợ
    }
  }

  const accuracy =
    Platform.OS === 'android'
      ? Location.Accuracy.Low
      : Location.Accuracy.Balanced;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('TIMEOUT')),
      LOCATION_TIMEOUT_MS
    )
  );

  let position = null;
  let usedCache = false;

  try {
    position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy }),
      timeoutPromise,
    ]);
  } catch (e) {
    if (e.message === 'TIMEOUT' || (e.message && e.message.includes('timeout'))) {
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: LAST_KNOWN_MAX_AGE_MS,
      });
      if (lastKnown && lastKnown.coords) {
        position = lastKnown;
        usedCache = true;
      }
    }
    if (!position) throw e;
  }

  const { latitude, longitude } = position.coords;
  return {
    lat: latitude,
    lng: longitude,
    isFromCache: usedCache,
  };
}
