import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.content}>
        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tF_1eIvvrD83eWRAoe-3d96B0aXaXs0jqAWxqyswKI8LBiqyVvXHOnhHzw7Lo0qP_mmp2JQP3ThRBAd0GohkAV439UpMYlBTQbLcWRY3WSY9C2s9jILWHGFq-ZDjSsiagrlYlpzMYlzr6tn60wG23atqijkSQSWYuGpd0_vlJ47riljO8rivoPHnrBImgTd_4MZ8AKU-xUIEDckE7iwA8Y3sEa_Fpguo4ZwL_MDTXnAITVBYEaXXfxKQb098GdXmTcTnamZUeU0' }} style={styles.avatar} />
        <Text style={styles.name}>{user?.username || user?.email || 'Người dùng'}</Text>
        <Text style={styles.phone}>{user?.email || ''}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  content: { flex: 1, alignItems: 'center', paddingTop: 32 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 6 },
  phone: { fontSize: 15, color: colors.gray600, marginBottom: 32 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.sos,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: colors.white },
};
