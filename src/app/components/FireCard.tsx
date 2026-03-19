import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FireCardProps {
  fire: 0 | 1;
}

export function FireCard({ fire }: FireCardProps) {
  const active = fire === 1;

  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-shadow duration-200 border ${
        active ? 'border-red-200 bg-red-50/40' : 'border-gray-200'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Fire
        </CardTitle>

        <div className={`rounded-xl p-2 ${active ? 'bg-red-100' : 'bg-gray-100'}`}>
          <Flame
            className={`h-4 w-4 ${active ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className={`text-2xl font-semibold tracking-tight ${
            active ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {active ? 'Alert' : 'Safe'}
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              active
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {active ? 'Fire detected' : 'No fire detected'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}