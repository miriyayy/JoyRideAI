import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserScreen() {
  const [isLocationOn, setIsLocationOn] = useState(true);
  const [isNotifOn, setIsNotifOn] = useState(true);

  return (
    <View style={styles.container}>
      {/* Profil Başlığı */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.userName}>Misafir Kullanıcı</Text>
        <Text style={styles.userRole}>İstanbul Kart: Öğrenci</Text>
      </View>

      <Text style={styles.sectionTitle}>Ayarlar</Text>

      {/* Konum Ayarı */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="location" size={24} color="#3b82f6" />
          <Text style={styles.settingText}>Konum Servisi</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          thumbColor={isLocationOn ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={() => setIsLocationOn(!isLocationOn)}
          value={isLocationOn}
        />
      </View>

      {/* Bildirim Ayarı */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="notifications" size={24} color="#f59e0b" />
          <Text style={styles.settingText}>Bildirimler</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          onValueChange={() => setIsNotifOn(!isNotifOn)}
          value={isNotifOn}
        />
      </View>

      {/* Çıkış Butonu */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatarContainer: { width: 80, height: 80, backgroundColor: '#334155', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  userName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  userRole: { color: '#94a3b8', fontSize: 14 },
  sectionTitle: { color: '#94a3b8', fontSize: 14, marginBottom: 10, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 15, borderRadius: 12, marginBottom: 15 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingText: { color: 'white', fontSize: 16, marginLeft: 10 },
  logoutButton: { marginTop: 20, padding: 15, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: 'bold' }
});