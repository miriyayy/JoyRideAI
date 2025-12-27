
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{alignItems:'center', marginTop: 40}}>
        <View style={styles.avatarContainer}>
           <Text style={{fontSize:40}}>👤</Text>
        </View>
        <Text style={styles.userName}>Misafir Kullanıcı</Text>
        <Text style={styles.userId}>İstanbul Kart ID: 1234 ****</Text>
      </View>

      <View style={{marginTop: 40}}>
        <TouchableOpacity style={styles.listItem}>
            <Ionicons name="card-outline" size={24} color="#3b82f6" />
            <Text style={[styles.listTitle, {marginLeft:15}]}>Kart Bakiyem</Text>
            <Text style={{color:'white', fontWeight:'bold', marginLeft:'auto'}}>54.00 ₺</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.goBack()}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={[styles.listTitle, {marginLeft:15, color:'#ef4444'}]}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  avatarContainer: {width:100, height:100, borderRadius:50, backgroundColor:'#3b82f6', justifyContent:'center', alignItems:'center', marginBottom:15},
  userName: {color:'white', fontSize:24, fontWeight:'bold'},
  userId: {color:'#94a3b8', fontSize:16},
  listItem: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 12, alignItems: 'center' },
  listTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});