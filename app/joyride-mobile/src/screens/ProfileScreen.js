// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ProfileScreen({ navigation }) {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Profil Başlığı */}
      <View style={{alignItems:'center', marginTop: 40}}>
        <View style={styles.avatarContainer}>
           <Text style={{fontSize:40}}>🚇</Text>
        </View>
        <Text style={styles.name}>İstanbul Gezgini</Text>
        <Text style={styles.idText}>Level 5 - Usta Yolcu</Text>
      </View>

      <View style={{marginTop: 40}}>
        
      <TouchableOpacity 
    style={styles.menuItem}
    onPress={() => {
        console.log("Butona basıldı!"); // Terminale yazar
        alert("Buton Çalışıyor!");      // Ekrana uyarı verir
        navigation.navigate('Map');     // Sayfaya gitmeyi dener
    }} 
>
    <View style={[styles.iconBox, {backgroundColor:'rgba(16, 185, 129, 0.1)'}]}>
        <Ionicons name="map" size={22} color="#10b981" />
    </View>
    <View style={{marginLeft:15, flex:1}}>
        <Text style={styles.menuTitle}>Raylı Sistem Haritası</Text>
        <Text style={styles.menuSub}>Test Modu</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#64748b" />
</TouchableOpacity>

        {/* Diğer ayarlar aynı kalabilir... */}
        <View style={styles.settingItem}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={[styles.iconBox, {backgroundColor:'rgba(59, 130, 246, 0.1)'}]}>
                    <Ionicons name="location" size={22} color="#3b82f6" />
                </View>
                <Text style={styles.settingText}>Canlı Konum Paylaş</Text>
            </View>
            <Switch 
                trackColor={{ false: "#767577", true: "#3b82f6" }}
                thumbColor={isLocationEnabled ? "white" : "#f4f3f4"}
                onValueChange={() => setIsLocationEnabled(!isLocationEnabled)}
                value={isLocationEnabled}
            />
        </View>

        <TouchableOpacity style={[styles.menuItem, {marginTop:20}]} onPress={() => navigation.goBack()}>
             <View style={[styles.iconBox, {backgroundColor:'rgba(239, 68, 68, 0.1)'}]}>
                <Ionicons name="log-out" size={22} color="#ef4444" />
            </View>
            <Text style={[styles.menuTitle, {marginLeft:15, color:'#ef4444'}]}>Çıkış Yap</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  avatarContainer: { width:100, height:100, borderRadius:50, backgroundColor:'#1e293b', justifyContent:'center', alignItems:'center', marginBottom:15, borderWidth:2, borderColor:'#3b82f6' },
  name: { color:'white', fontSize:24, fontWeight:'bold' },
  idText: { color:'#94a3b8', fontSize:14, marginTop:5 },
  settingItem: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#1e293b', padding:15, borderRadius:16, marginBottom:15 },
  settingText: { color:'white', fontSize:16, fontWeight:'bold', marginLeft:15 },
  menuItem: { flexDirection:'row', alignItems:'center', backgroundColor:'#1e293b', padding:15, borderRadius:16, marginBottom:10 },
  menuTitle: { color:'white', fontSize:16, fontWeight:'bold' },
  menuSub: { color:'#94a3b8', fontSize:12 },
  iconBox: { width:40, height:40, borderRadius:10, justifyContent:'center', alignItems:'center' }
});

export default ProfileScreen;