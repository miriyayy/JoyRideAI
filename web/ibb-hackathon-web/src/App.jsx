import { useState } from 'react'
import { Train, Bus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import stationData from './data/prediction.js'
import './App.css'

function App() {
  const [selectedStation, setSelectedStation] = useState(null)
  const [optimizationApplied, setOptimizationApplied] = useState({})

  const handleOptimization = (stationId) => {
    setOptimizationApplied(prev => ({
      ...prev,
      [stationId]: true
    }))
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
    return density > 80 ? '#ef4444' : '#3b82f6' // Red if > 80, else Blue
  }

  const getAlertBoxStyle = (station) => {
    const isApplied = optimizationApplied[station.id]
    if (isApplied) {
      return 'border-green-500/50 bg-green-500/10'
    }
    
    if (station.web_view.status === 'critical') {
      return 'border-red-500/50 bg-red-500/10'
    } else if (station.web_view.status === 'warning') {
      return 'border-orange-500/50 bg-orange-500/10'
    }
    return 'border-blue-500/50 bg-blue-500/10'
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar/Left Panel */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">IBB Smart City</h1>
          <p className="text-sm text-slate-400 mt-1">Decision Support System</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Stations ({stationData.length})
            </h2>
            
            <div className="space-y-2">
              {stationData.map((station) => {
                const isSelected = selectedStation?.id === station.id
                const density = station.metrics.predicted_density
                const badgeColor = getDensityBadgeColor(density)
                const badgeText = getDensityBadgeText(density)
                
                return (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {station.type === 'metro' ? (
                          <Train className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <Bus className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            {station.location_name}
                          </p>
                          <p className="text-sm text-slate-400 mt-0.5">
                            {station.line}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-500">
                        Density: {density}%
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main/Right Panel */}
      <div className="flex-1 bg-slate-900 overflow-y-auto">
        {selectedStation ? (
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedStation.location_name}
                </h2>
                <p className="text-slate-400">{selectedStation.line} • {selectedStation.scenario_time}</p>
              </div>
              <div className={`px-6 py-3 rounded-lg border-2 font-bold text-2xl ${
                selectedStation.metrics.predicted_density >= 80 
                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                  : selectedStation.metrics.predicted_density >= 50
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-green-500/20 text-green-400 border-green-500/50'
              }`}>
                %{selectedStation.metrics.predicted_density}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Current Capacity</p>
                <p className="text-3xl font-bold text-white">{selectedStation.metrics.current_capacity.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Passenger Count</p>
                <p className="text-3xl font-bold text-white">{selectedStation.metrics.passenger_count.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Predicted Density</p>
                <p className="text-3xl font-bold text-white">{selectedStation.metrics.predicted_density}%</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedStation.hourly_forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="density" 
                    stroke={getChartColor(selectedStation.metrics.predicted_density)}
                    strokeWidth={3}
                    dot={{ fill: getChartColor(selectedStation.metrics.predicted_density), r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Decision Support Center */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">AI Decision Support Center</h3>
              {selectedStation.web_view.action_required && (
                <div className={`border-2 rounded-lg p-4 mb-4 ${getAlertBoxStyle(selectedStation)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-2">Status: {selectedStation.web_view.status.toUpperCase()}</p>
                      <p className="text-slate-200">{selectedStation.web_view.suggestion}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptimization(selectedStation.id)}
                    disabled={optimizationApplied[selectedStation.id]}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      optimizationApplied[selectedStation.id]
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {optimizationApplied[selectedStation.id] ? 'Optimization Applied ✓' : 'Apply AI Optimization'}
                  </button>
                </div>
              )}
              {!selectedStation.web_view.action_required && (
                <div className="border-2 border-green-500/50 bg-green-500/10 rounded-lg p-4">
                  <p className="text-green-400 font-semibold mb-2">Status: NORMAL</p>
                  <p className="text-slate-200">{selectedStation.web_view.suggestion}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-slate-400">
              Select a station to view details
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App