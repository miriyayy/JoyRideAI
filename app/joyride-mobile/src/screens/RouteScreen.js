import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// Mobil için lucide-react-native kullanmalısın
import { Clock, Ship, AlertTriangle, Armchair, Zap } from 'lucide-react-native';

const routes = [
  {
    type: 'fastest',
    badge: 'En Hızlı',
    transport: ['Marmaray', 'M2'],
    duration: '35 dk',
    savings: '15 dk Kazanç',
    description: 'Trafik yok, raylı sistem kullan',
    color: '#22c55e', // Yeşil
    icon: <Zap size={18} color="#22c55e" />
  },
  {
    type: 'comfort',
    badge: 'Deniz Havası',
    transport: ['Vapur'],
    duration: '48 dk',
    description: 'Oturma Garantili - Manzaralı yolculuk',
    color: '#3b82f6', // Mavi
    icon: <Ship size={18} color="#3b82f6" />
  },
  {
    type: 'warning',
    badge: 'Dikkat',
    transport: ['Metrobüs'],
    duration: '42 dk',
    description: 'Aşırı kalabalık bekleniyor',
    color: '#ef4444', // Kırmızı
    icon: <AlertTriangle size={18} color="#ef4444" />
  }
];

export default function RouteScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Akıllı Güzergahlar</Text>
        <Text style={styles.subtitle}>AI tarafından önerilen rotalar</Text>
      </View>

      <View style={styles.list}>
        {routes.map((route, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.card, 
              route.type === 'warning' && styles.warningCard
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { borderColor: route.color + '40', backgroundColor: route.color + '20' }]}>
                {route.icon}
                <Text style={[styles.badgeText, { color: route.color }]}>{route.badge}</Text>
              </View>
              <View style={styles.durationBox}>
                <Clock size={14} color="#94a3b8" />
                <Text style={styles.durationText}>{route.duration}</Text>
              </View>
            </View>

            <View style={styles.transportRow}>
              {route.transport.map((t, i) => (
                <View key={i} style={styles.transportBadge}>
                  <Text style={styles.transportText}>{t}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.description}>{route.description}</Text>

            {route.savings && (
              <View style={styles.savingsTag}>
                <Zap size={14} color="#22c55e" />
                <Text style={styles.savingsText}>{route.savings}</Text>
              </View>
            )}

            {route.type === 'comfort' && (
              <View style={styles.comfortTag}>
                <Armchair size={14} color="#3b82f6" />
                <Text style={styles.comfortText}>Konforlu</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.pulseDot} />
        <Text style={styles.footerText}>Rotalar gerçek zamanlı trafik verilerine göre güncelleniyor</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { marginBottom: 25, marginTop: 20 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 16, marginTop: 5 },
  list: { gap: 16 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  warningCard: {
    borderColor: '#ef444450',
    backgroundColor: '#450a0a30',
    borderWidth: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  durationBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  durationText: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },
  transportRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  transportBadge: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#475569' },
  transportText: { color: 'white', fontSize: 13 },
  description: { color: '#94a3b8', fontSize: 14, marginBottom: 15, lineHeight: 20 },
  savingsTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#14532d30', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#22c55e40' },
  savingsText: { color: '#4ade80', fontSize: 12, fontWeight: '600' },
  comfortTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1e3a8a30', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#3b82f640' },
  comfortText: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  footer: { marginTop: 30, padding: 15, backgroundColor: '#1e293b50', borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 50 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#06b6d4' },
  footerText: { color: '#64748b', fontSize: 12 }
});