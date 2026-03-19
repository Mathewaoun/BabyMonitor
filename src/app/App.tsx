import { useState, useEffect, useRef } from 'react';
import { Code, RefreshCw } from 'lucide-react';
import { ConnectionIndicator } from './components/ConnectionIndicator';
import { AlertBanner } from './components/AlertBanner';
import { TemperatureCard } from './components/TemperatureCard';
import { HumidityCard } from './components/HumidityCard';
import { MotionCard } from './components/MotionCard';
import { SoundCard } from './components/SoundCard';
import { FireCard } from './components/FireCard';
import { DistanceCard } from './components/DistanceCard';
import { BuzzerCard } from './components/BuzzerCard';
import { RelayCard } from './components/RelayCard';
import { EventHistory } from './components/EventHistory';
import { DebugDrawer } from './components/DebugDrawer';
import { Button } from './components/ui/button';

interface SensorData {
  temp: number;
  hum: number;
  dhtOk: 0 | 1;
  sound: 0 | 1;
  fire: 0 | 1;
  motion: 0 | 1;
  distance: number;
  buzzer: 0 | 1;
  relay: 0 | 1;
}

interface Event {
  id: string;
  timestamp: Date;
  type: 'fire' | 'motion' | 'sound' | 'temperature' | 'humidity' | 'distance' | 'buzzer' | 'relay' | 'normal';
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}
const ESP32_URL = 'http://172.20.10.3/data';

const fetchSensorData = async (): Promise<SensorData> => {
  const response = await fetch(ESP32_URL);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  return {
    temp: Number(data.temp ?? 0),
    hum: Number(data.hum ?? 0),
    dhtOk: Number(data.dhtOk ?? 0) as 0 | 1,
    sound: Number(data.sound ?? 0) as 0 | 1,
    fire: Number(data.fire ?? 0) as 0 | 1,
    motion: Number(data.motion ?? 0) as 0 | 1,
    distance: Number(data.distance ?? -1),
    buzzer: Number(data.buzzer ?? 0) as 0 | 1,
    relay: Number(data.relay ?? 0) as 0 | 1,
  };
};

const TEMP_WARNING_THRESHOLD = 30;
const TEMP_LOW_THRESHOLD = 18;
const HUM_LOW_THRESHOLD = 30;
const HUM_HIGH_THRESHOLD = 70;
const DISTANCE_CLOSE_THRESHOLD = 20;

export default function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temp: 24,
    hum: 55,
    dhtOk: 1,
    sound: 0,
    fire: 0,
    motion: 0,
    distance: 75,
    buzzer: 0,
    relay: 0,
  });
  
  const [isConnected, setIsConnected] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const previousDataRef = useRef<SensorData | null>(null);

  // Generate events from sensor data changes
  const generateEvents = (data: SensorData, prevData: SensorData): Event[] => {
    const now = new Date();
    const newEvents: Event[] = [];
    
    // CRITICAL: Fire detection
    if (data.fire === 1 && prevData.fire === 0) {
      newEvents.push({
        id: `event-fire-${Date.now()}`,
        timestamp: now,
        type: 'fire',
        message: '🔥 Fire detected! Immediate action required',
        priority: 'critical',
      });
    }
    
    // HIGH: Motion detection
    if (data.motion === 1 && prevData.motion === 0) {
      newEvents.push({
        id: `event-motion-${Date.now()}`,
        timestamp: now,
        type: 'motion',
        message: 'Motion detected in monitoring area',
        priority: 'high',
      });
    }
    
    // HIGH: Sound/Crying detection
    if (data.sound === 1 && prevData.sound === 0) {
      newEvents.push({
        id: `event-sound-${Date.now()}`,
        timestamp: now,
        type: 'sound',
        message: '👶 Infant crying detected - attention needed',
        priority: 'high',
      });
    }
    
    // HIGH: Temperature warnings
    if (data.temp > TEMP_WARNING_THRESHOLD && prevData.temp <= TEMP_WARNING_THRESHOLD) {
      newEvents.push({
        id: `event-temp-high-${Date.now()}`,
        timestamp: now,
        type: 'temperature',
        message: `⚠️ High temperature alert: ${data.temp.toFixed(1)}°C (above ${TEMP_WARNING_THRESHOLD}°C)`,
        priority: 'high',
      });
    }
    
    // MEDIUM: Temperature too low
    if (data.temp < TEMP_LOW_THRESHOLD && prevData.temp >= TEMP_LOW_THRESHOLD) {
      newEvents.push({
        id: `event-temp-low-${Date.now()}`,
        timestamp: now,
        type: 'temperature',
        message: `❄️ Low temperature alert: ${data.temp.toFixed(1)}°C (below ${TEMP_LOW_THRESHOLD}°C)`,
        priority: 'medium',
      });
    }
    
    // MEDIUM: Humidity warnings
    if (data.hum < HUM_LOW_THRESHOLD && prevData.hum >= HUM_LOW_THRESHOLD) {
      newEvents.push({
        id: `event-hum-low-${Date.now()}`,
        timestamp: now,
        type: 'humidity',
        message: `Air too dry: ${data.hum.toFixed(0)}% humidity (below ${HUM_LOW_THRESHOLD}%)`,
        priority: 'medium',
      });
    }
    
    if (data.hum > HUM_HIGH_THRESHOLD && prevData.hum <= HUM_HIGH_THRESHOLD) {
      newEvents.push({
        id: `event-hum-high-${Date.now()}`,
        timestamp: now,
        type: 'humidity',
        message: `Air too humid: ${data.hum.toFixed(0)}% humidity (above ${HUM_HIGH_THRESHOLD}%)`,
        priority: 'medium',
      });
    }
    
    // MEDIUM: Distance warnings
    if (data.distance < DISTANCE_CLOSE_THRESHOLD && prevData.distance >= DISTANCE_CLOSE_THRESHOLD) {
      newEvents.push({
        id: `event-distance-${Date.now()}`,
        timestamp: now,
        type: 'distance',
        message: `Object very close: ${data.distance.toFixed(0)} cm detected`,
        priority: 'medium',
      });
    }
    
    // LOW: Buzzer state changes
    if (data.buzzer === 1 && prevData.buzzer === 0) {
      newEvents.push({
        id: `event-buzzer-on-${Date.now()}`,
        timestamp: now,
        type: 'buzzer',
        message: 'Buzzer activated',
        priority: 'low',
      });
    }
    
    if (data.buzzer === 0 && prevData.buzzer === 1) {
      newEvents.push({
        id: `event-buzzer-off-${Date.now()}`,
        timestamp: now,
        type: 'buzzer',
        message: 'Buzzer deactivated',
        priority: 'low',
      });
    }
    
    // LOW: Relay state changes
    if (data.relay === 1 && prevData.relay === 0) {
      newEvents.push({
        id: `event-relay-on-${Date.now()}`,
        timestamp: now,
        type: 'relay',
        message: 'Relay switched ON',
        priority: 'low',
      });
    }
    
    if (data.relay === 0 && prevData.relay === 1) {
      newEvents.push({
        id: `event-relay-off-${Date.now()}`,
        timestamp: now,
        type: 'relay',
        message: 'Relay switched OFF',
        priority: 'low',
      });
    }
    
    return newEvents;
  };

  // Fetch data periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSensorData();
        
        const previous = previousDataRef.current ?? data;
        const newEvents = generateEvents(data, previous);

        if (newEvents.length > 0) {
          setEvents(prev => [...newEvents, ...prev].slice(0, 100));
        }

        previousDataRef.current = data;
        setSensorData(data);
        setIsConnected(true);
        setLastSync(new Date());
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 2 seconds
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSensorData();
      
      const previous = previousDataRef.current ?? data;
      const newEvents = generateEvents(data, previous);

      if (newEvents.length > 0) {
        setEvents(prev => [...newEvents, ...prev].slice(0, 100));
      }

      previousDataRef.current = data;
      setSensorData(data);
      setIsConnected(true);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setIsConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Infant Monitor</h1>
              <p className="text-sm text-gray-600">Real-time health and safety monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-xs h-9"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDebugOpen(true)}
                className="text-xs h-9"
              >
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Debug
              </Button>
            </div>
          </div>
          <ConnectionIndicator isConnected={isConnected} lastSync={lastSync} />
        </div>

        {/* Alert Banner */}
        <div className="mb-8">
          <AlertBanner data={sensorData} />
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <TemperatureCard temp={sensorData.temp} dhtOk={sensorData.dhtOk} />
          <HumidityCard hum={sensorData.hum} dhtOk={sensorData.dhtOk} />
          <MotionCard motion={sensorData.motion} />
          <SoundCard sound={sensorData.sound} />
          <FireCard fire={sensorData.fire} />
          <DistanceCard distance={sensorData.distance} />
          <BuzzerCard buzzer={sensorData.buzzer} />
          <RelayCard relay={sensorData.relay} />
        </div>

        {/* Event History */}
        <EventHistory events={events} />
      </div>

      {/* Debug Drawer */}
      <DebugDrawer
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        data={sensorData}
      />
    </div>
  );
}