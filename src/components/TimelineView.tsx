import React from 'react';
import { CheckCircle2, Clock, AlertCircle, UserCheck, Truck, ShieldCheck, XCircle } from 'lucide-react';
import { ReportStatus } from '../types';

interface TimelineStep {
  stage: string;
  timestamp: string;
  note?: string;
}

interface TimelineViewProps {
  timeline: TimelineStep[];
  currentStatus: ReportStatus;
}

const STAGES = [
  'Request Created',
  'Under Review',
  'Verified',
  'Volunteer Assigned',
  'In Progress',
  'Resolved',
];

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, currentStatus }) => {
  // Determine index of current status
  const getStatusIndex = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return 0; // Request Created / Under Review
      case 'VERIFIED':
        return 2;
      case 'ASSIGNED':
        return 3;
      case 'IN_PROGRESS':
        return 4;
      case 'RESOLVED':
        return 5;
      case 'REJECTED':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);

  const getStageIcon = (index: number, isCompleted: boolean, isCurrent: boolean) => {
    if (currentStatus === 'REJECTED') {
      return <XCircle className="w-5 h-5 text-rose-500" />;
    }
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (isCurrent) {
      return <Clock className="w-5 h-5 text-amber-500 animate-spin" />;
    }
    return <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />;
  };

  return (
    <div className="w-full bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm my-3">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Response Audit Timeline
        </h4>
        <span
          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
            currentStatus === 'RESOLVED'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : currentStatus === 'IN_PROGRESS'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : currentStatus === 'ASSIGNED'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : currentStatus === 'VERIFIED'
              ? 'bg-sky-100 text-sky-800 border-sky-300'
              : currentStatus === 'REJECTED'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          STATUS: {currentStatus}
        </span>
      </div>

      {/* Timeline Steps (Desktop Stepper Header) */}
      <div className="hidden md:flex items-center justify-between relative mb-6 px-2">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-6 h-1 bg-teal-500 -translate-y-1/2 transition-all duration-500 z-0"
          style={{
            width:
              currentIndex === -1
                ? '0%'
                : `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 92}%`,
          }}
        />

        {STAGES.map((stageName, idx) => {
          const isDone = currentIndex >= idx && currentIndex !== -1;
          const isCurrent = currentIndex === idx;

          return (
            <div key={stageName} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105'
                    : isCurrent
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md animate-pulse scale-110'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                {getStageIcon(idx, isDone, isCurrent)}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1.5 text-center max-w-[80px] leading-tight ${
                  isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {stageName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Activity History Log */}
      <div className="space-y-3">
        {timeline.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xl shadow-slate-100/50"
          >
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{step.stage}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {step.timestamp}
                </span>
              </div>
              {step.note && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
