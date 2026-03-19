import { Wifi, WifiOff, Clock } from 'lucide-react';

interface ConnectionIndicatorProps {
  isConnected: boolean;
  lastSync: Date | null;
}

export function ConnectionIndicator({
  isConnected,
  lastSync,
}: ConnectionIndicatorProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              Offline
            </>
          )}
        </span>

        <span className="text-sm text-gray-600">
          ESP32 data connection
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>Last sync: {formatTime(lastSync)}</span>
      </div>
    </div>
  );
}