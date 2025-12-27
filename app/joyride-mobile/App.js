
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Kendi oluşturduğumuz ekranları import ediyoruz
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import RouteScreen from './src/screens/RouteScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
        <Stack.Screen name="Home" component={HomeScreen} />
        
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{headerShown: true, title: 'Durak Detayı', headerTintColor:'white', headerStyle:{backgroundColor:'#0f172a'}}} 
        />
        
        <Stack.Screen 
          name="RouteSuggestions" 
          component={RouteScreen} 
          options={{headerShown: true, title: 'Rota Önerileri', headerTintColor:'white', headerStyle:{backgroundColor:'#0f172a'}}} 
        />
        
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{headerShown: true, title: 'Profil', headerTintColor:'white', headerStyle:{backgroundColor:'#0f172a'}}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}