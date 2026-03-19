import { Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SoundCardProps {
  sound: 0 | 1;
}

export function SoundCard({ sound }: SoundCardProps) {
  const active = sound === 1;

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Sound
        </CardTitle>

        <div className={`rounded-xl p-2 ${active ? 'bg-amber-50' : 'bg-gray-100'}`}>
          <Volume2 className={`h-4 w-4 ${active ? 'text-amber-600' : 'text-gray-400'}`} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold tracking-tight ${active ? 'text-amber-600' : 'text-gray-500'}`}>
          {active ? 'Detected' : 'Quiet'}
        </div>

        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              active
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {active ? 'Sound detected' : 'No sound'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}