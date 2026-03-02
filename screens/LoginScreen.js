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
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmed = (email || '').trim();
    if (!trimmed || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const { user: u } = await login(trimmed, password);
      setLoading(false);
      const root = navigation.getParent();
      if (u?.role === 'coordinator' || u?.role === 'admin') {
        if (root) root.reset({ index: 0, routes: [{ name: 'RescueTeamStack' }] });
        else navigation.navigate('RescueTeamStack');
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Home', params: { citizenLoggedIn: true } }] });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Đăng nhập thất bại', err.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>CỨU HỘ</Text>
          </View>
          <Text style={styles.headerTitle}>CỨU HỘ VIỆT NAM</Text>
          <Text style={styles.headerSubtitle}>Kết nối hỗ trợ khẩn cấp</Text>
        </View>

        <View style={styles.roleTabs}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'citizen' && styles.roleTabActive]}
            onPress={() => setRole('citizen')}
            disabled={loading}
          >
            <Text style={[styles.roleTabText, role === 'citizen' && styles.roleTabTextActive]}>Người dân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'official' && styles.roleTabActive]}
            onPress={() => setRole('official')}
            disabled={loading}
          >
            <Text style={[styles.roleTabText, role === 'official' && styles.roleTabTextActive]}>Cán bộ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={colors.gray500}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={colors.gray500}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                <Text style={styles.togglePwd}>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.loginBtn, loading && styles.loginBtnDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={styles.loginBtnText}>Đăng nhập</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Đăng ký</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 24 },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: { fontSize: 12, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4, letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: colors.gray200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  roleTabActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  roleTabText: { fontSize: 13, fontWeight: '600', color: colors.gray600 },
  roleTabTextActive: { color: colors.primary },
  form: { gap: 16 },
  formGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: colors.text,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.gray300, borderRadius: 10, paddingHorizontal: 14 },
  inputFlex: { flex: 1, height: 46, fontSize: 15, color: colors.text, paddingVertical: 0 },
  togglePwd: { fontSize: 13, color: colors.primary, fontWeight: '600', paddingVertical: 12 },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 13, color: colors.textSecondary },
  signupLink: { fontWeight: '700', color: colors.primary },
};
