import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/screens/MapScreen';

// Dosya yollarına dikkat et (senin klasör yapına göre ayarladım)
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import RouteScreen from './src/screens/RouteScreen';
import ProfileScreen from './src/screens/ProfileScreen'; 
// Not: Eğer UserScreen tasarımını kullanmak istersen yukarıdaki ProfileScreen yerine UserScreen import edebilirsin.

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: '#0f172a' } 
        }}
      >
        {/* Ana Ekran */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Detay Ekranı (Zincirlikuyu vb. tıklayınca) */}
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{
            headerShown: true, 
            title: 'Durak Analizi',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: 'white'
          }}
        />

        {/* Rota Önerileri Ekranı (Butona basınca) */}
        <Stack.Screen 
          name="RouteSuggestions" 
          component={RouteScreen} 
          options={{
            headerShown: true, 
            title: 'Akıllı Rota Önerileri',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: 'white'
          }}
        />

        {/* Profil Ekranı (Sağ üstteki ikona basınca) */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            headerShown: true, 
            title: 'Profilim',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown:true, title:'İstanbul Raylı Sistemler', headerStyle:{backgroundColor:'#0f172a'}, headerTintColor:'white'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}