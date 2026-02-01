import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

// Mock data for login
const RESCUE_TEAM_CREDENTIALS = {
  email: 'rescueteam1@fpt.edu.vn',
  password: '123456',
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (
        email === RESCUE_TEAM_CREDENTIALS.email &&
        password === RESCUE_TEAM_CREDENTIALS.password
      ) {
        setLoading(false);
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('RescueTeamStack'),
          },
        ]);
      } else {
        setLoading(false);
        Alert.alert(
          'Đăng nhập thất bại',
          'Email hoặc mật khẩu không chính xác'
        );
      }
    }, 800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 24 }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng nhập đội cứu hộ</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 64 }}>🚨</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>CỨU HỘ VN</Text>
          <Text style={styles.subtitle}>Hệ thống quản lý cứu hộ thiên tai</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email đội cứu hộ</Text>
            <View style={styles.inputContainer}>
              <Text style={{ fontSize: 18 }}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="rescueteam1@fpt.edu.vn"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Text style={{ fontSize: 18 }}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text style={{ fontSize: 18 }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo Credentials Info */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>📝 Thông tin đăng nhập demo:</Text>
            <Text style={styles.demoText}>
              Email: rescueteam1@fpt.edu.vn
            </Text>
            <Text style={styles.demoText}>Mật khẩu: 123456</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? '⏳ Đang đăng nhập...' : '🔓 ĐĂNG NHẬP'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Back to Citizen */}
          <TouchableOpacity
            style={styles.citizenBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.citizenBtnText}>
              👤 QUAY LẠI TRANG NGƯỜI DÂN
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bạn là thành viên đội cứu hộ? Đăng nhập để quản lý nhiệm vụ cứu hộ.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4277a9',
    shadowColor: '#4277a9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  demoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1e40af',
    marginBottom: 6,
  },
  demoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  loginBtn: {
    backgroundColor: '#4277a9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4277a9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  citizenBtn: {
    borderWidth: 2,
    borderColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  citizenBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#d32f2f',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fff8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffdddd',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    lineHeight: 18,
  },
};
