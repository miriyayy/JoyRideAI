
import React from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions } from 'react-native';

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView minimumZoomScale={1} maximumZoomScale={5}>
        {/* İstanbul Raylı Sistemler Haritası (Resmi URL) */}
        <Image 
          source={{ uri: 'https://www.metro.istanbul/Content/assets/img/Haritalar/M2.jpg' }} 
          // Not: Hackathon için M2 hattını koydum, tüm haritayı bulursan linki değiştirebilirsin.
          // Alternatif (Tüm harita): 'https://data.ibb.gov.tr/dataset/rayli-sistemler-haritasi/resource/...' 
          style={styles.mapImage}
          resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  mapImage: { 
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height,
    marginTop: 20
  }
});

export default MapScreen;