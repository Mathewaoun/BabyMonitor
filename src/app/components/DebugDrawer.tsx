import { Code, X } from 'lucide-react';
import { Button } from './ui/button';

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

interface DebugDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: SensorData;
}

export function DebugDrawer({ isOpen, onClose, data }: DebugDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-100 p-2">
              <Code className="h-4 w-4 text-gray-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Debug Data</h3>
              <p className="text-xs text-gray-500">Live sensor payload</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-5">
          <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-xs leading-6 text-emerald-400 shadow-inner">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}