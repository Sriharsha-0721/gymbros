import React from 'react';
import { WorkoutLog } from '../../types';
import { Card } from '../common/Card';
import { Dumbbell, Clock, Flame, Trash2, Calendar } from 'lucide-react';
import { formatFriendlyDate } from '../../lib/dateUtils';

interface AttendanceHistoryListProps {
  logs: WorkoutLog[];
  onDeleteLog: (id: string) => void;
  onOpenCheckIn: () => void;
}

export const AttendanceHistoryList: React.FC<AttendanceHistoryListProps> = ({
  logs,
  onDeleteLog,
  onOpenCheckIn,
}) => {
  const getIntensityBadge = (intensity?: string) => {
    switch (intensity) {
      case 'pr_beast':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
            PR Beast Mode 🔥
          </span>
        );
      case 'heavy':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
            Heavy Work
          </span>
        );
      case 'light':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            Light Recovery
          </span>
        );
      case 'moderate':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
            Moderate
          </span>
        );
    }
  };

  return (
    <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1b202e]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#181d2a] text-slate-300">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Workout Attendance History
            </h3>
            <p className="text-xs text-slate-400">
              Verified completed gym sessions ({logs.length})
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCheckIn}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#ccff00] text-[#090a0f] hover:bg-[#d8ff33] transition-colors"
        >
          + Check-in
        </button>
      </div>

      <div className="pt-3.5">
        {logs.length > 0 ? (
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3 rounded-xl bg-[#151824] border border-[#202638] hover:border-[#2f3850] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#1b2030] text-[#ccff00] mt-0.5">
                    <Dumbbell size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">
                        {log.workout_type || 'Gym Workout'}
                      </span>
                      {getIntensityBadge(log.intensity)}
                    </div>

                    <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {formatFriendlyDate(log.date)}
                      </span>
                      {log.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-500" />
                          {log.duration_minutes} min
                        </span>
                      )}
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-300 mt-1.5 bg-[#121520] px-2.5 py-1.5 rounded-lg border border-[#1e2334] italic">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove log"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No completed workouts logged yet.{' '}
            <button
              onClick={onOpenCheckIn}
              className="text-[#ccff00] font-bold underline underline-offset-2 ml-1"
            >
              Log your first session today!
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
