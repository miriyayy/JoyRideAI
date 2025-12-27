import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Train, Bus, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import stationData from './data/prediction.js'
import './App.css'

// Component to handle map view updates when station is selected
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

function App() {
  const [selectedStation, setSelectedStation] = useState(null)
  const [optimizationApplied, setOptimizationApplied] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate center of all stations for initial map view
  const mapCenter = stationData.length > 0 
    ? [stationData.reduce((sum, s) => sum + s.coordinates[0], 0) / stationData.length,
       stationData.reduce((sum, s) => sum + s.coordinates[1], 0) / stationData.length]
    : [41.0082, 28.9784] // Default to Istanbul center

  const handleOptimization = (stationId) => {
    setOptimizationApplied(prev => ({
      ...prev,
      [stationId]: true
    }))
  }

  const getMarkerColor = (density) => {
    if (density > 80) return '#ef4444' // Red
    if (density > 50) return '#f97316' // Orange
    return '#22c55e' // Green
  }

  const getMarkerSize = (density) => {
    if (density > 80) return 20
    if (density > 50) return 15
    return 10
  }

  const getDensityBadgeColor = (density) => {
    if (density < 50) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (density < 80) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const getDensityBadgeText = (density) => {
    if (density < 50) return 'Low'
    if (density < 80) return 'Medium'
    return 'High'
  }

  const getChartColor = (density) => {
    return density > 80 ? '#ef4444' : '#3b82f6'
  }

  const getAlertBoxStyle = (station) => {
    const isApplied = optimizationApplied[station.id]
    if (isApplied) {
      return 'border-green-500/50 bg-green-500/10 shadow-green-500/20'
    }
    
    if (station.web_view.status === 'critical') {
      return 'border-red-500/50 bg-red-500/10 shadow-red-500/20'
    } else if (station.web_view.status === 'warning') {
      return 'border-orange-500/50 bg-orange-500/10 shadow-orange-500/20'
    }
    return 'border-blue-500/50 bg-blue-500/10 shadow-blue-500/20'
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900">
      {/* Layer 1: Background Map */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer
          center={selectedStation ? selectedStation.coordinates : mapCenter}
          zoom={selectedStation ? 14 : 12}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Map Controller for updating view */}
          {selectedStation && (
            <MapController center={selectedStation.coordinates} zoom={14} />
          )}
          
          {/* Station Markers */}
          {stationData.map((station) => {
            const density = station.metrics.predicted_density
            const isSelected = selectedStation?.id === station.id
            const color = getMarkerColor(density)
            const size = getMarkerSize(density)
            
            return (
              <CircleMarker
                key={station.id}
                center={station.coordinates}
                radius={size}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.8,
                  color: 'white',
                  weight: isSelected ? 3 : 2,
                  opacity: 1
                }}
                className={density > 80 ? 'animate-pulse' : ''}
                eventHandlers={{
                  click: () => setSelectedStation(station)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{station.location_name}</p>
                    <p className="text-gray-600">{station.line}</p>
                    <p className="text-gray-500">Density: {density}%</p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Layer 2: UI Overlays */}
      
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-16 bg-slate-900/80 backdrop-blur-md shadow-2xl border-b border-white/10">
        <div className="flex items-center justify-between px-8 h-full">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              İBB Akıllı Şehir Operasyon Merkezi
            </h1>
            <p className="text-xs text-white/70 mt-0.5">Real-time Transportation Management System</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <Clock className="w-4 h-4 text-white/80" />
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{formatTime(currentTime)}</div>
              <div className="text-xs text-white/70">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute top-20 left-4 bottom-4 w-80 z-40 bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-xl border border-white/10 overflow-y-auto">
        <div className="p-6 border-b border-white/10 sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-semibold text-white mb-1">Stations</h2>
          <p className="text-sm text-white/60">{stationData.length} active locations</p>
        </div>
        
        <div className="p-4 space-y-3">
          {stationData.map((station) => {
            const isSelected = selectedStation?.id === station.id
            const density = station.metrics.predicted_density
            const badgeColor = getDensityBadgeColor(density)
            const badgeText = getDensityBadgeText(density)
            
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {station.type === 'metro' ? (
                    <Train className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Bus className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {station.location_name}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {station.line}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-white/50">
                    {density}%
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Detail Panel */}
      {selectedStation && (
        <div className="absolute top-20 right-4 bottom-4 w-[450px] z-40 bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-xl border border-white/10 text-white">
          {/* Scrollable Content Container */}
          <div className="h-full overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedStation.location_name}
                  </h2>
                  <p className="text-sm text-white/70">{selectedStation.line} • {selectedStation.scenario_time}</p>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="text-white/60 hover:text-white transition-colors text-2xl font-light ml-2"
                >
                  ×
                </button>
              </div>
              <div className={`inline-block px-4 py-2 rounded-lg border-2 font-bold text-xl ${
                selectedStation.metrics.predicted_density >= 80 
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/20'
                  : selectedStation.metrics.predicted_density >= 50
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-lg shadow-orange-500/20'
                  : 'bg-green-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-500/20'
              }`}>
                %{selectedStation.metrics.predicted_density}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Metrics</h3>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-white/60 mb-1">Current Capacity</p>
                  <p className="text-2xl font-bold text-white">{selectedStation.metrics.current_capacity.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-white/60 mb-1">Passenger Count</p>
                  <p className="text-2xl font-bold text-white">{selectedStation.metrics.passenger_count.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-white/60 mb-1">Predicted Density</p>
                  <p className="text-2xl font-bold text-white">{selectedStation.metrics.predicted_density}%</p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Hourly Forecast</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedStation.hourly_forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ffffff60"
                    style={{ fontSize: '10px' }}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    style={{ fontSize: '10px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="density" 
                    stroke={getChartColor(selectedStation.metrics.predicted_density)}
                    strokeWidth={3}
                    dot={{ fill: getChartColor(selectedStation.metrics.predicted_density), r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Decision Support Center */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-4">AI Decision Support</h3>
              {selectedStation.web_view.action_required && (
                <div className={`border-2 rounded-xl p-4 ${getAlertBoxStyle(selectedStation)} shadow-lg`}>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wider">
                      Status: {selectedStation.web_view.status}
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">{selectedStation.web_view.suggestion}</p>
                  </div>
                  <button
                    onClick={() => handleOptimization(selectedStation.id)}
                    disabled={optimizationApplied[selectedStation.id]}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                      optimizationApplied[selectedStation.id]
                        ? 'bg-green-600/80 text-white cursor-not-allowed shadow-lg shadow-green-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
                    }`}
                  >
                    {optimizationApplied[selectedStation.id] ? '✓ Optimization Applied' : 'Apply AI Optimization'}
                  </button>
                </div>
              )}
              {!selectedStation.web_view.action_required && (
                <div className="border-2 border-green-500/50 bg-green-500/10 rounded-xl p-4 shadow-lg shadow-green-500/20">
                  <p className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Status: Normal</p>
                  <p className="text-sm text-white/80">{selectedStation.web_view.suggestion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App