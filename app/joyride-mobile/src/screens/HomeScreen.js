
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateSmartRoutes } from '../utils/mockBackend'; // Algoritmayı içe aktardık

export default function HomeScreen({ navigation }) {
  const [selectedStation, setSelectedStation] = useState("Yenikapı");
  const [density, setDensity] = useState(92);

  const handleFindRoute = () => {
    const suggestedRoutes = generateSmartRoutes(selectedStation, density);
    navigation.navigate('RouteSuggestions', { routes: suggestedRoutes });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>JoyRide</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
           <Ionicons name="person-circle-outline" size={36} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput 
          value={selectedStation}
          style={styles.searchInput}
          onChangeText={setSelectedStation}
          placeholder="Durak Ara..."
          placeholderTextColor="#94a3b8"
        />
        <View style={{backgroundColor:'#3b82f6', padding:8, borderRadius:8}}>
            <Ionicons name="search" size={20} color="white" />
        </View>
      </View>

      <View style={[styles.densityCard, { backgroundColor: density > 80 ? '#b91c1c' : '#15803d' }]}>
        <Text style={styles.stationName}>{selectedStation}</Text>
        <Text style={styles.lineName}>M2 Hattı</Text>
        <Text style={styles.bigNumber}>%{density}</Text>
        <Text style={styles.densityLabel}>{density > 80 ? 'AŞIRI YOĞUN' : 'NORMAL'}</Text>
        {density > 80 && (
            <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="white" />
            <Text style={styles.warningText}>Yoğunluk yüksek! Alternatif rota önerilir.</Text>
            </View>
        )}
      </View>

      <TouchableOpacity style={styles.routeButton} onPress={handleFindRoute}>
        <Text style={styles.routeButtonText}>Alternatif Rota Bul 🚀</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Yakındaki İstasyonlar</Text>
      
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => navigation.navigate('Detail', { stationName: 'Zincirlikuyu', density: 88 })}
      >
        <View style={styles.iconBox}><Ionicons name="bus" size={24} color="white" /></View>
        <View style={{flex:1, marginLeft: 10}}>
            <Text style={styles.listTitle}>Zincirlikuyu</Text>
            <Text style={styles.listSub}>Metrobüs</Text>
        </View>
        <Text style={[styles.listPercent, {color: '#ef4444'}]}>%88</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  appName: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  searchBar: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 8, borderRadius: 12, marginBottom: 20, alignItems:'center' },
  searchInput: { color: 'white', marginLeft: 10, flex: 1, fontSize: 16, padding:5 },
  densityCard: { borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 20 },
  stationName: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign:'center' },
  lineName: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 10 },
  bigNumber: { color: 'white', fontSize: 72, fontWeight: 'bold' },
  densityLabel: { color: 'white', fontSize: 14, letterSpacing: 2, marginBottom: 20, fontWeight:'bold' },
  warningBox: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, alignItems: 'center', width:'100%' },
  warningText: { color: 'white', marginLeft: 10, fontSize: 12, flex: 1 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  listItem: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12, alignItems: 'center' },
  iconBox: { width: 40, height: 40, backgroundColor: '#334155', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  listTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listSub: { color: '#94a3b8', fontSize: 12 },
  listPercent: { fontWeight: 'bold', fontSize: 16 },
  routeButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  routeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});