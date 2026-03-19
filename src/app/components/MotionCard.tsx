import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MotionCardProps {
  motion: 0 | 1;
}

export function MotionCard({ motion }: MotionCardProps) {
  const active = motion === 1;

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Motion
        </CardTitle>

        <div className={`rounded-xl p-2 ${active ? 'bg-orange-50' : 'bg-gray-100'}`}>
          <Activity className={`h-4 w-4 ${active ? 'text-orange-600' : 'text-gray-400'}`} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold tracking-tight ${active ? 'text-orange-600' : 'text-gray-500'}`}>
          {active ? 'Active' : 'Idle'}
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              active
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {active ? 'Movement detected' : 'No movement'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}