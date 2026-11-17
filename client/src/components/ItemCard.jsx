import React from 'react';
import { Calendar, Trash2, Edit3, CheckCircle2, Clock, AlertCircle, Check } from 'lucide-react';

export const ItemCard = ({ item, isSelected, onSelect, onEdit, onDelete, onStatusChange }) => {
  const priorityStyles = {
    low: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      accent: 'from-emerald-400 to-teal-500',
      dot: 'bg-emerald-500',
    },
    medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      accent: 'from-amber-400 to-orange-500',
      dot: 'bg-amber-500',
    },
    high: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      accent: 'from-rose-500 to-red-600',
      dot: 'bg-rose-500',
    },
  };

  const statusIcons = {
    pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
    'in-progress': <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
    completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  };

  const currentPriority = priorityStyles[item.priority] || priorityStyles.medium;
  const isCompleted = item.status === 'completed';

  // Format relative due date
  const getDueLabel = (dateStr) => {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
    if (diffDays === 0) return { text: 'Due today', isOverdue: false, isSoon: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isOverdue: false, isSoon: true };
    return { text: `Due in ${diffDays}d`, isOverdue: false };
  };

  const dueInfo = getDueLabel(item.dueDate);

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white/95 rounded-2xl p-5 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden border ${
        isSelected
          ? 'ring-2 ring-indigo-600 border-indigo-400 shadow-xl shadow-indigo-100/80 -translate-y-1.5 bg-gradient-to-b from-indigo-50/40 via-white to-white'
          : 'border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-300'
      }`}
    >
      {/* Top Accent Gradient Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentPriority.accent} transition-all duration-300 ${
          isSelected ? 'h-1.5' : 'group-hover:h-1.5'
        }`}
      />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${currentPriority.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
              <span>{item.priority}</span>
            </span>

            {dueInfo && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  dueInfo.isOverdue
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : dueInfo.isSoon
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {dueInfo.text}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium capitalize bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            {statusIcons[item.status]}
            <span>{item.status}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-semibold mb-1.5 transition-colors duration-200 line-clamp-2 ${
            isSelected ? 'text-indigo-950 font-bold' : 'text-slate-900 group-hover:text-indigo-600'
          } ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : ''}`}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {item.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Details & Quick Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No deadline'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item._id, e.target.value)}
            className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-110 active:scale-95 transition-all"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
