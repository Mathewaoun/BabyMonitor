import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface HumidityCardProps {
  hum: number;
  dhtOk: 0 | 1;
}

export function HumidityCard({ hum, dhtOk }: HumidityCardProps) {
  const getTone = () => {
    if (!dhtOk) {
      return {
        valueClass: 'text-gray-400',
        iconClass: 'text-gray-400',
        iconBg: 'bg-gray-100',
        badgeClass: 'bg-gray-100 text-gray-600',
        label: 'Sensor offline',
      };
    }

    if (hum < 30) {
      return {
        valueClass: 'text-orange-600',
        iconClass: 'text-orange-600',
        iconBg: 'bg-orange-50',
        badgeClass: 'bg-orange-100 text-orange-700',
        label: 'Too dry',
      };
    }

    if (hum > 70) {
      return {
        valueClass: 'text-blue-600',
        iconClass: 'text-blue-600',
        iconBg: 'bg-blue-50',
        badgeClass: 'bg-blue-100 text-blue-700',
        label: 'Too humid',
      };
    }

    return {
      valueClass: 'text-emerald-600',
      iconClass: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      label: 'Optimal',
    };
  };

  const tone = getTone();

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Humidity
        </CardTitle>

        <div className={`rounded-xl p-2 ${tone.iconBg}`}>
          <Droplets className={`h-4 w-4 ${tone.iconClass}`} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold tracking-tight ${tone.valueClass}`}>
          {dhtOk ? `${hum.toFixed(0)}%` : '—'}
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.badgeClass}`}
          >
            {tone.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}