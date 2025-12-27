import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, AlertTriangle, Bus, Train } from 'lucide-react-native';
import stationData from './data/predictions.json';

export default function App() {
  // Get the first station as current location
  const currentStation = stationData[0];
  const nearbyStations = stationData.slice(1);
  
  const currentDensity = currentStation.metrics.predicted_density;
  const isHighDensity = currentDensity > 80;
  
  // Get warning message (use app_view.message if available, otherwise web_view.suggestion)
  const warningMessage = currentStation.app_view?.message || 
                         currentStation.web_view?.suggestion || 
                         '';

  // Get density color for nearby stations
  const getDensityColor = (density) => {
    if (density > 80) return '#ef4444'; // Red
    if (density > 60) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  // Get icon based on type
  const getIcon = (type) => {
    return type === 'metro' ? Train : Bus;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>İstanbul Senin</Text>
        </View>

        {/* Main Hero Card */}
        <LinearGradient
          colors={isHighDensity 
            ? ['#7f1d1d', '#991b1b', '#dc2626'] // Dark Red gradient
            : ['#064e3b', '#047857', '#10b981'] // Green gradient
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View style={styles.locationHeader}>
              <MapPin size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.currentLocationLabel}>Current Location</Text>
            </View>
            
            <Text style={styles.stationName}>{currentStation.location_name}</Text>
            <Text style={styles.stationLine}>{currentStation.line}</Text>
            
            <View style={styles.densityContainer}>
              <Text style={styles.densityPercentage}>{currentDensity}%</Text>
              <Text style={styles.densityLabel}>Density</Text>
            </View>

            {warningMessage && (
              <View style={styles.warningContainer}>
                <AlertTriangle size={20} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.warningText}>{warningMessage}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Nearby Stations Section */}
        <View style={styles.nearbySection}>
          <Text style={styles.nearbyTitle}>Nearby Stations</Text>
          
          {nearbyStations.map((station) => {
            const Icon = getIcon(station.type);
            const density = station.metrics.predicted_density;
            const densityColor = getDensityColor(density);
            
            return (
              <View key={station.id} style={styles.stationItem}>
                <View style={styles.stationIconContainer}>
                  <Icon size={24} color="#cbd5e1" strokeWidth={2} />
                </View>
                
                <View style={styles.stationInfo}>
                  <Text style={styles.stationItemName}>{station.location_name}</Text>
                  <Text style={styles.stationItemLine}>{station.line}</Text>
                </View>
                
                <View style={styles.stationDensity}>
                  <View style={[styles.densityDot, { backgroundColor: densityColor }]} />
                  <Text style={styles.stationDensityText}>{density}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Slate
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  stationLine: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    fontWeight: '500',
  },
  densityContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  densityPercentage: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  densityLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  warningText: {
    fontSize: 15,
    color: '#ffffff',
    marginLeft: 10,
    flex: 1,
    fontWeight: '600',
  },
  nearbySection: {
    paddingHorizontal: 20,
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stationInfo: {
    flex: 1,
  },
  stationItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  stationItemLine: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  stationDensity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  densityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  stationDensityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 45,
    textAlign: 'right',
  },
});
