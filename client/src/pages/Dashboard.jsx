import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  Check,
  Edit3,
  Trash2,
  X,
  Target,
  ArrowUpRight,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;

      const { data } = await API.get('/items', { params });
      setItems(data);
      if (selectedItem) {
        const found = data.find((i) => i._id === selectedItem._id);
        setSelectedItem(found || null);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter]);

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        const { data } = await API.put(`/items/${editingItem._id}`, formData);
        setItems(items.map((i) => (i._id === data._id ? data : i)));
        if (selectedItem?._id === data._id) setSelectedItem(data);
      } else {
        const { data } = await API.post('/items', formData);
        setItems([data, ...items]);
        setSelectedItem(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Error saving item: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/items/${id}`);
        setItems(items.filter((item) => item._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await API.put(`/items/${id}`, { status: newStatus });
      setItems(items.map((i) => (i._id === data._id ? data : i)));
      if (selectedItem?._id === id) setSelectedItem(data);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCardSelect = (item) => {
    setSelectedItem((prev) => (prev?._id === item._id ? null : item));
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Stats calculation
  const totalCount = items.length;
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const inProgressCount = items.filter((i) => i.status === 'in-progress').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Hero Welcome & Productivity Header */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            You have <span className="font-semibold text-slate-700">{inProgressCount} tasks</span> in progress and{' '}
            <span className="font-semibold text-slate-700">{pendingCount} pending</span> today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Progress Pill Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[240px] shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sprint Progress</span>
              </span>
              <span className="font-bold text-indigo-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 text-right">
              {completedCount} of {totalCount} tasks completed
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-3 rounded-2xl font-semibold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => {
            setStatusFilter('all');
            setPriorityFilter('all');
          }}
          className={`bg-white/90 backdrop-blur-sm p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'all'
              ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-md'
              : 'border-slate-200/80 hover:border-indigo-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Tasks</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>Overall task pool</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          className={`bg-white/90 backdrop-blur-sm p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'pending'
              ? 'border-amber-400 ring-2 ring-amber-50 shadow-md'
              : 'border-slate-200/80 hover:border-amber-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            Awaiting action
          </div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'in-progress' ? 'all' : 'in-progress')}
          className={`bg-white/90 backdrop-blur-sm p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'in-progress'
              ? 'border-blue-400 ring-2 ring-blue-50 shadow-md'
              : 'border-slate-200/80 hover:border-blue-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">In Progress</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{inProgressCount}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            Actively being worked
          </div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`bg-white/90 backdrop-blur-sm p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            statusFilter === 'completed'
              ? 'border-emerald-400 ring-2 ring-emerald-50 shadow-md'
              : 'border-slate-200/80 hover:border-emerald-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Successfully closed
          </div>
        </div>
      </div>

      {/* Control Bar: Tab Pills + Search & Priority */}
      <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Status Filter Tab Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full lg:w-auto p-1 bg-slate-100/80 rounded-xl">
          {[
            { id: 'all', label: 'All', count: totalCount },
            { id: 'in-progress', label: 'In Progress', count: inProgressCount },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Priority Controls */}
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 text-xs text-slate-500 font-medium">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-slate-50/70 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-slate-700"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-sm border border-dashed border-slate-300 rounded-3xl">
          <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No tasks found</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
            {search || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No tasks match your active filters. Try broadening your criteria.'
              : 'Your workspace is clear! Start adding your goals and assignments.'}
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              isSelected={selectedItem?._id === item._id}
              onSelect={handleCardSelect}
              onEdit={openEditModal}
              onDelete={handleDeleteItem}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Floating Action Bar When a Task is Chosen/Selected */}
      {selectedItem && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                selectedItem.priority === 'high'
                  ? 'bg-rose-500'
                  : selectedItem.priority === 'medium'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Selected Task
              </span>
              <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md">
                {selectedItem.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {selectedItem.status !== 'completed' ? (
              <button
                onClick={() => handleStatusChange(selectedItem._id, 'completed')}
                className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                title="Mark as Completed"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Done</span>
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange(selectedItem._id, 'in-progress')}
                className="flex items-center space-x-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                title="Mark In Progress"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resume</span>
              </button>
            )}

            <button
              onClick={() => openEditModal(selectedItem)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDeleteItem(selectedItem._id)}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedItem(null)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer ml-1"
              title="Deselect"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
};
