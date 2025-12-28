import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getOptimizedRoute } from '../services/apiService'; // Az önce oluşturduğun servis

const RouteScreen = () => {
  const [loading, setLoading] = useState(false);
  const [optimizedData, setOptimizedData] = useState(null);

  // Test için sabit duraklar (Kullanıcı seçimine göre burayı dinamik yapabilirsin)
  const testStops = [
    { name: "Kadıköy", lat: 40.99, lon: 29.02 },
    { name: "Taksim", lat: 41.03, lon: 28.98 },
    { name: "Beşiktaş", lat: 41.04, lon: 29.00 },
    { name: "Eminönü", lat: 41.01, lon: 28.97 }
  ];

  const handleOptimization = async () => {
    setLoading(true);
    try {
      const result = await getOptimizedRoute(testStops);
      setOptimizedData(result);
    } catch (error) {
      alert("Yapay zeka rotayı hesaplarken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleOptimization}>
        <Text style={styles.buttonText}>Yapay Zeka ile Rotayı Optimize Et</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 20 }} />}

      {optimizedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.totalDist}>Toplam Mesafe: {optimizedData.total_distance_km} km</Text>
          <FlatList
            data={optimizedData.route}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.routeItem}>
                <Text style={styles.routeIndex}>{index + 1}</Text>
                <Text style={styles.routeName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  button: { backgroundColor: '#38bdf8', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  resultContainer: { marginTop: 30, flex: 1 },
  totalDist: { color: '#94a3b8', fontSize: 18, marginBottom: 20, textAlign: 'center' },
  routeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#1e293b', padding: 15, borderRadius: 8 },
  routeIndex: { color: '#38bdf8', fontWeight: 'bold', fontSize: 18, marginRight: 15 },
  routeName: { color: 'white', fontSize: 16 }
});

export default RouteScreen;