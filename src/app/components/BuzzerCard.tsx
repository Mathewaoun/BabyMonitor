import { Bell, BellOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface BuzzerCardProps {
  buzzer: 0 | 1;
}

export function BuzzerCard({ buzzer }: BuzzerCardProps) {
  const active = buzzer === 1;

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Buzzer
        </CardTitle>

        <div className={`rounded-xl p-2 ${active ? 'bg-purple-50' : 'bg-gray-100'}`}>
          {active ? (
            <Bell className="h-4 w-4 text-purple-600" />
          ) : (
            <BellOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className={`text-2xl font-semibold tracking-tight ${
            active ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          {active ? 'On' : 'Off'}
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              active
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {active ? 'Buzzer active' : 'Buzzer inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}