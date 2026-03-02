# Cấu hình bản đồ (Google Maps) trên Android

Khi màn hình Home hiển thị **bản đồ trắng**, cần thêm **Google Maps API key** cho Android.

## Bước 1: Lấy API key

1. Vào [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo project mới hoặc chọn project có sẵn.
3. Vào **APIs & Services** → **Library** → bật **Maps SDK for Android**.
4. Vào **APIs & Services** → **Credentials** → **Create credentials** → **API key**.
5. Copy API key vừa tạo.

## Bước 2: Gắn key vào app

Mở file **`app.json`**, tìm và thay `YOUR_GOOGLE_MAPS_ANDROID_KEY` bằng API key của bạn ở **hai chỗ**:

- Trong **plugins**: `["react-native-maps", {"googleMapsApiKey": "AIza..."}]`
- Trong **android.config**: `"config": {"googleMaps": {"apiKey": "AIza..."}}`

## Bước 3: Build lại app

API key được nhúng lúc build, **hot reload không đủ**. Chạy:

```bash
npx expo prebuild --clean
npx expo run:android
```

Hoặc với EAS Build:

```bash
eas build --profile development --platform android
```

Sau khi build xong, mở app lại — bản đồ sẽ hiển thị bình thường.
