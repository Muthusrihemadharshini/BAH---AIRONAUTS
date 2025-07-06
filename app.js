import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, AlertTriangle, Heart, Wind, Eye, Thermometer, Droplets, Calendar, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AirQualityApp = () => {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [currentAQI, setCurrentAQI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [alerts, setAlerts] = useState([]);

  // Sample cities data
  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 }
  ];

  // Generate realistic AQI data
  const generateAQIData = (city) => {
    const baseAQI = {
      'Delhi': 180,
      'Mumbai': 120,
      'Bangalore': 95,
      'Chennai': 110,
      'Kolkata': 155,
      'Hyderabad': 85
    };
    
    const variation = Math.random() * 40 - 20;
    return Math.max(0, Math.min(500, baseAQI[city] + variation));
  };

  // Historical data for trends
  const generateHistoricalData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      aqi: Math.floor(Math.random() * 200) + 50,
      pm25: Math.floor(Math.random() * 100) + 20,
      pm10: Math.floor(Math.random() * 150) + 30
    }));
  };

  // Forecast data
  const generateForecastData = () => {
    const today = new Date();
    const forecast = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      forecast.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        aqi: Math.floor(Math.random() * 180) + 70,
        confidence: Math.floor(Math.random() * 30) + 70
      });
    }
    return forecast;
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { category: 'Good', color: '#00e400', bgColor: 'bg-green-100' };
    if (aqi <= 100) return { category: 'Moderate', color: '#ffff00', bgColor: 'bg-yellow-100' };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00', bgColor: 'bg-orange-100' };
    if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000', bgColor: 'bg-red-100' };
    if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97', bgColor: 'bg-purple-100' };
    return { category: 'Hazardous', color: '#7e0023', bgColor: 'bg-red-200' };
  };

  const getHealthAdvice = (aqi) => {
    const category = getAQICategory(aqi);
    
    const advice = {
      'Good': [
        'Perfect day for outdoor activities! 🌟',
        'Great air quality for jogging and sports',
        'Windows can be kept open for fresh air'
      ],
      'Moderate': [
        'Generally acceptable air quality',
        'Sensitive individuals should limit prolonged outdoor activities',
        'Good day for most outdoor activities'
      ],
      'Unhealthy for Sensitive Groups': [
        'Sensitive groups should reduce outdoor activities',
        'Consider wearing masks during outdoor activities',
        'Keep windows closed during peak hours'
      ],
      'Unhealthy': [
        'Avoid outdoor activities, especially jogging',
        'Keep children indoors during peak hours',
        'Use air purifiers if available',
        'Wear N95 masks when going outside'
      ],
      'Very Unhealthy': [
        'Stay indoors as much as possible',
        'Avoid all outdoor physical activities',
        'Use air purifiers and keep windows closed',
        'Seek medical attention if experiencing symptoms'
      ],
      'Hazardous': [
        'Emergency conditions - stay indoors!',
        'Avoid all outdoor activities',
        'Use air purifiers and seal windows',
        'Consult healthcare provider if experiencing symptoms'
      ]
    };

    return advice[category.category] || [];
  };

  const pollutionSources = [
    { name: 'Vehicle Emissions', percentage: 35, color: '#ff6b6b' },
    { name: 'Industrial Activity', percentage: 25, color: '#4ecdc4' },
    { name: 'Construction Dust', percentage: 20, color: '#45b7d1' },
    { name: 'Crop Burning', percentage: 15, color: '#f9ca24' },
    { name: 'Other Sources', percentage: 5, color: '#6c5ce7' }
  ];

  useEffect(() => {
    const fetchAQI = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const aqi = generateAQIData(selectedCity);
        setCurrentAQI(aqi);
        
        // Generate alerts based on AQI
        const category = getAQICategory(aqi);
        if (aqi > 150) {
          setAlerts([
            {
              type: 'warning',
              message: `High pollution alert in ${selectedCity}! AQI is ${Math.floor(aqi)} - ${category.category}`,
              time: new Date().toLocaleTimeString()
            }
          ]);
        } else {
          setAlerts([]);
        }
        
        setLoading(false);
      }, 1000);
    };

    fetchAQI();
  }, [selectedCity]);

  const historicalData = generateHistoricalData();
  const forecastData = generateForecastData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wind className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">AirWatch Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Use GPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          {alerts.map((alert, index) => (
            <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-sm opacity-75">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'current', label: 'Current AQI', icon: Eye },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'forecast', label: 'Forecast', icon: Calendar },
            { id: 'health', label: 'Health Advice', icon: Heart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current AQI Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Current Air Quality</h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedCity}</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`inline-block p-8 rounded-full ${getAQICategory(currentAQI).bgColor} mb-4`}>
                      <div className="text-6xl font-bold" style={{ color: getAQICategory(currentAQI).color }}>
                        {Math.floor(currentAQI)}
                      </div>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-2">
                      {getAQICategory(currentAQI).category}
                    </div>
                    <div className="text-gray-600">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pollution Breakdown */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pollutant Levels</h3>
                <div className="space-y-4">
                  {[
                    { name: 'PM2.5', value: Math.floor(Math.random() * 100) + 20, unit: 'μg/m³', color: 'bg-red-500' },
                    { name: 'PM10', value: Math.floor(Math.random() * 150) + 30, unit: 'μg/m³', color: 'bg-orange-500' },
                    { name: 'NO2', value: Math.floor(Math.random() * 80) + 10, unit: 'μg/m³', color: 'bg-yellow-500' },
                    { name: 'O3', value: Math.floor(Math.random() * 120) + 20, unit: 'μg/m³', color: 'bg-blue-500' }
                  ].map(pollutant => (
                    <div key={pollutant.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${pollutant.color}`}></div>
                        <span className="text-gray-700">{pollutant.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {pollutant.value} {pollutant.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="font-semibold">28°C</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600">Humidity</div>
                      <div className="font-semibold">65%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-600">Wind Speed</div>
                      <div className="font-semibold">12 km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7-Day Air Quality Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} name="AQI" />
                    <Line type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={2} name="PM2.5" />
                    <Line type="monotone" dataKey="pm10" stroke="#f59e0b" strokeWidth={2} name="PM10" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pollution Sources</h3>
              <div className="space-y-3">
                {pollutionSources.map(source => (
                  <div key={source.name} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{source.name}</span>
                        <span className="text-sm text-gray-600">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${source.percentage}%`,
                            backgroundColor: source.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3-Day Air Quality Forecast</h2>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="aqi" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastData.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{day.date}</div>
                    <div className={`text-3xl font-bold mb-2`} style={{ color: getAQICategory(day.aqi).color }}>
                      {Math.floor(day.aqi)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{getAQICategory(day.aqi).category}</div>
                    <div className="text-xs text-gray-500">
                      {day.confidence}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Recommendations</h2>
              <div className={`p-4 rounded-lg mb-6 ${getAQICategory(currentAQI).bgColor}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <div className="text-lg font-semibold text-gray-900">
                    Current AQI: {Math.floor(currentAQI)} - {getAQICategory(currentAQI).category}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
                  <ul className="space-y-3">
                    {getHealthAdvice(currentAQI).map((advice, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerable Groups</h3>
                  <div className="space-y-3">
                    {[
                      { group: 'Children', risk: currentAQI > 100 ? 'High' : 'Moderate' },
                      { group: 'Elderly', risk: currentAQI > 150 ? 'High' : 'Moderate' },
                      { group: 'Heart Disease', risk: currentAQI > 100 ? 'High' : 'Low' },
                      { group: 'Respiratory Issues', risk: currentAQI > 100 ? 'High' : 'Moderate' }
                    ].map(item => (
                      <div key={item.group} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.group}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.risk === 'High' ? 'bg-red-100 text-red-800' : 
                          item.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.risk} Risk
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bell className="h-4 w-4" />
                <span>Enable Alerts</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                API Access
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Data updated every 15 minutes • WHO Standards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityApp;
