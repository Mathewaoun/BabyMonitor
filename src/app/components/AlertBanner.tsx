import { Flame, AlertTriangle, Volume2, Thermometer, CheckCircle2 } from 'lucide-react';

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

interface AlertBannerProps {
  data: SensorData;
}

const TEMP_WARNING_THRESHOLD = 30;

export function AlertBanner({ data }: AlertBannerProps) {
  let title = 'System Normal';
  let message = 'No active alerts. Monitoring is running normally.';
  let icon = <CheckCircle2 className="w-5 h-5" />;
  let wrapperClass =
    'border border-emerald-200 bg-emerald-50 text-emerald-900';
  let badgeClass =
    'bg-emerald-100 text-emerald-700 border border-emerald-200';
  let badgeText = 'NORMAL';

  if (data.fire === 1) {
    title = 'Fire Alert';
    message = 'Fire detected in the monitoring area. Immediate action required.';
    icon = <Flame className="w-5 h-5" />;
    wrapperClass =
      'border border-red-200 bg-red-50 text-red-900';
    badgeClass =
      'bg-red-100 text-red-700 border border-red-200';
    badgeText = 'CRITICAL';
  } else if (data.motion === 1) {
    title = 'Motion Detected';
    message = 'Movement detected in the infant monitoring area.';
    icon = <AlertTriangle className="w-5 h-5" />;
    wrapperClass =
      'border border-orange-200 bg-orange-50 text-orange-900';
    badgeClass =
      'bg-orange-100 text-orange-700 border border-orange-200';
    badgeText = 'HIGH';
  } else if (data.sound === 1) {
    title = 'Sound Detected';
    message = 'Sound activity detected. The infant may need attention.';
    icon = <Volume2 className="w-5 h-5" />;
    wrapperClass =
      'border border-amber-200 bg-amber-50 text-amber-900';
    badgeClass =
      'bg-amber-100 text-amber-700 border border-amber-200';
    badgeText = 'HIGH';
  } else if (data.temp > TEMP_WARNING_THRESHOLD) {
    title = 'Temperature Warning';
    message = `Room temperature is elevated at ${data.temp.toFixed(1)}°C.`;
    icon = <Thermometer className="w-5 h-5" />;
    wrapperClass =
      'border border-yellow-200 bg-yellow-50 text-yellow-900';
    badgeClass =
      'bg-yellow-100 text-yellow-700 border border-yellow-200';
    badgeText = 'WARNING';
  }

  return (
    <div className={`rounded-2xl px-5 py-4 shadow-sm ${wrapperClass}`}>
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${badgeClass}`}
            >
              {badgeText}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 opacity-90">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}