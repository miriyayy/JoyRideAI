import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        // Eğer Google Maps yüklü değilse varsayılan (Apple Maps/OSM) açılır
        provider={PROVIDER_GOOGLE} 
        style={styles.map}
        // İstanbul koordinatları ile başlatıyoruz
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.1, // Zoom seviyesi
          longitudeDelta: 0.1,
        }}
        // Harita tipi: standart, satellite, hybrid
        mapType="standard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // flex: 1 de yazabilirsin ama Dimensions en garantisidir
    flex: 1,
  },
});