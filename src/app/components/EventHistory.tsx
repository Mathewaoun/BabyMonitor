import { Clock, Flame, Activity, Volume2, Thermometer, Droplets, Ruler, Bell, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Event {
  id: string;
  timestamp: Date;
  type: 'fire' | 'motion' | 'sound' | 'temperature' | 'humidity' | 'distance' | 'buzzer' | 'relay' | 'normal';
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface EventHistoryProps {
  events: Event[];
}

export function EventHistory({ events }: EventHistoryProps) {
  const recentEvents = events.slice(0, 20);

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'fire':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'motion':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'sound':
        return <Volume2 className="w-4 h-4 text-amber-500" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'humidity':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'distance':
        return <Ruler className="w-4 h-4 text-purple-500" />;
      case 'buzzer':
        return <Bell className="w-4 h-4 text-indigo-500" />;
      case 'relay':
        return <Power className="w-4 h-4 text-cyan-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: Event['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-700">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600">
            Low
          </span>
        );
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Recent Events
          </CardTitle>
          <span className="text-xs text-gray-500">
            {recentEvents.length} shown
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[220px] pr-3">
          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="w-7 h-7 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No events yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getEventIcon(event.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 leading-5">
                          {event.message}
                        </p>
                        {getPriorityBadge(event.priority)}
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}