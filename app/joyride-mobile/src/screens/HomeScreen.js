// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// MockBackend'den yeni fonksiyonu da çağırıyoruz: getStationData
import { generateSmartRoutes, getStationData } from '../utils/mockBackend'; 

function HomeScreen({ navigation }) {
  const [fromStation, setFromStation] = useState("Yenikapı");
  const [toStation, setToStation] = useState(""); 
  
  // Ekranda gösterilecek dinamik veriler
  const [displayData, setDisplayData] = useState({
    density: 92,
    status: "AŞIRI YOĞUN",
    lines: ["M1", "M2", "Marmaray"]
  });

  // Kullanıcı durak ismini değiştirdiğinde veritabanından bilgileri çek
  useEffect(() => {
    const data = getStationData(fromStation);
    setDisplayData({
        density: data.density,
        status: data.status,
        lines: data.lines
    });
  }, [fromStation]); // fromStation her değiştiğinde çalışır

  const handleFindRoute = () => {
    const suggestedRoutes = generateSmartRoutes(fromStation, toStation);
    navigation.navigate('RouteSuggestions', { routes: suggestedRoutes });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>JoyRide</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
           <Ionicons name="person-circle-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.plannerCard}>
        <Text style={styles.plannerTitle}>Yolculuk Planla 📍</Text>
        
        <View style={styles.inputRow}>
            <Ionicons name="navigate-circle" size={24} color="#3b82f6" />
            <TextInput 
                value={fromStation}
                style={styles.input}
                onChangeText={setFromStation} // Yazdıkça veriler güncellenecek
                placeholder="Başlangıç (Örn: Yenikapı)"
                placeholderTextColor="#64748b"
            />
        </View>
        <View style={{height:1, backgroundColor:'#334155', marginVertical:10, marginLeft:34}} />
        <View style={styles.inputRow}>
            <Ionicons name="flag" size={24} color="#ef4444" />
            <TextInput 
                value={toStation}
                style={styles.input}
                onChangeText={setToStation}
                placeholder="Nereye? (Örn: Söğütlüçeşme)"
                placeholderTextColor="#64748b"
            />
        </View>
      </View>

      {/* --- AKILLI YOĞUNLUK KARTI --- */}
      <View style={[styles.densityCard, { backgroundColor: displayData.density > 80 ? '#b91c1c' : '#15803d' }]}>
        <Text style={styles.stationName}>{fromStation}</Text>
        
        {/* Hat Bilgilerini Göster (M2, Marmaray vb.) */}
        <View style={{flexDirection:'row', marginVertical:10}}>
            {displayData.lines.map((line, i) => (
                <View key={i} style={{backgroundColor:'rgba(0,0,0,0.3)', paddingHorizontal:8, paddingVertical:4, borderRadius:5, marginRight:5}}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:12}}>{line}</Text>
                </View>
            ))}
        </View>

        <Text style={styles.bigNumber}>%{displayData.density}</Text>
        <Text style={styles.densityLabel}>{displayData.status}</Text>
        
        {displayData.density > 80 && (
            <View style={styles.warningBox}>
                <Ionicons name="alert-circle" size={20} color="white" />
                <Text style={styles.warningText}>Yoğunluk çok yüksek! Alternatif rotaları kontrol et.</Text>
            </View>
        )}
      </View>

      <TouchableOpacity style={styles.routeButton} onPress={handleFindRoute}>
        <Text style={styles.routeButtonText}>En Mantıklı Rotayı Bul 🚀</Text>
      </TouchableOpacity>

      {/* Diğer kısımlar aynı... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  appName: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  plannerCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 16, marginBottom: 20 },
  plannerTitle: { color:'#94a3b8', fontSize:12, marginBottom:10, fontWeight:'bold', textTransform:'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { color: 'white', marginLeft: 10, flex: 1, fontSize: 16, padding: 5 },
  densityCard: { borderRadius: 24, padding: 25, alignItems: 'center', marginBottom: 20 },
  stationName: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  statusText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5 },
  bigNumber: { color: 'white', fontSize: 64, fontWeight: 'bold' },
  densityLabel: { color: 'white', fontSize: 16, letterSpacing: 1, fontWeight:'bold', marginBottom:15 },
  warningBox: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, alignItems: 'center' },
  warningText: { color: 'white', marginLeft: 10, fontSize: 12, flex: 1 },
  routeButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  routeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;