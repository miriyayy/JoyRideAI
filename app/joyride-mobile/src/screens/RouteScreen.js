
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RouteScreen({ route }) {
  const { routes } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Alternatif Rotalar</Text>
      <Text style={{color:'#94a3b8', marginBottom:20}}>Yapay zeka tarafından optimize edildi.</Text>
      
      {routes.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.routeTitle}>{item.title}</Text>
            <Text style={{color:'#4ade80', fontWeight:'bold'}}>{item.saving}</Text>
          </View>
          
          <Text style={{color:'#cbd5e1', marginTop:5, marginBottom:10}}>{item.desc}</Text>
          
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {item.tags.map((tag, index) => (
                <View key={index} style={{backgroundColor:'#334155', padding:5, borderRadius:5, marginRight:5}}>
                    <Text style={{color:'white', fontSize:12}}>{tag}</Text>
                </View>
            ))}
          </View>

          <Text style={{color:'#4ade80', marginTop:10, fontSize:12}}>Tahmini Yoğunluk: %{item.densityScore}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 15 },
  routeTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});