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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/theme';

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();
  const [role, setRole] = useState('citizen');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const name = fullName.trim();
    const em = email.trim();
    if (!name) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }
    if (!em) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý Điều khoản và Chính sách bảo mật');
      return;
    }

    setLoading(true);
    try {
      const username = name.replace(/\s+/g, '_').slice(0, 50) || 'user';
      await register(username, em, password, role === 'official' ? 'coordinator' : 'user');
      setLoading(false);
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      setLoading(false);
      Alert.alert('Đăng ký thất bại', err.message || 'Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.roleTabs}>
          <TouchableOpacity style={[styles.roleTab, role === 'citizen' && styles.roleTabActive]} onPress={() => setRole('citizen')} disabled={loading}>
            <Text style={[styles.roleTabText, role === 'citizen' && styles.roleTabTextActive]}>Người dân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleTab, role === 'official' && styles.roleTabActive]} onPress={() => setRole('official')} disabled={loading}>
            <Text style={[styles.roleTabText, role === 'official' && styles.roleTabTextActive]}>Cán bộ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput style={styles.input} placeholder="Nguyễn Văn A" placeholderTextColor={colors.gray500} value={fullName} onChangeText={setFullName} editable={!loading} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="email@example.com" placeholderTextColor={colors.gray500} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput style={styles.input} placeholder="Ít nhất 6 ký tự" placeholderTextColor={colors.gray500} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} editable={!loading} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nhập lại mật khẩu</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.gray500} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} editable={!loading} />
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)} disabled={loading}>
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>{agreeTerms ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}</View>
            <Text style={styles.termsText}>Tôi đồng ý Điều khoản sử dụng và Chính sách bảo mật</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={styles.submitBtnText}>Tạo tài khoản</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Đã có tài khoản? <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Đăng nhập</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  roleTabs: { flexDirection: 'row', backgroundColor: colors.gray200, borderRadius: 12, padding: 4, marginBottom: 20 },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  roleTabActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  roleTabText: { fontSize: 13, fontWeight: '600', color: colors.gray600 },
  roleTabTextActive: { color: colors.primary },
  form: { gap: 14 },
  formGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.gray300, borderRadius: 10, paddingHorizontal: 14, height: 46, fontSize: 15, color: colors.text },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: { flex: 1, fontSize: 12, color: colors.textSecondary },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 13, color: colors.textSecondary },
  loginLink: { fontWeight: '700', color: colors.primary },
};
