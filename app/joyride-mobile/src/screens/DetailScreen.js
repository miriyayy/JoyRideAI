
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailScreen({ route }) {
  const { stationName, density } = route.params;
  return (
    <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
      <Text style={styles.bigNumber}>%{density}</Text>
      <Text style={styles.subText}>{stationName}</Text>
      <Text style={{color:'#94a3b8', textAlign:'center', marginTop:10}}>
        Veri Analizi Detayları Burada Görünecek.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  bigNumber: { color: 'white', fontSize: 72, fontWeight: 'bold' },
  subText: {color:'white', fontSize:24, fontWeight:'bold', marginTop:10},
});