'use client';

import React from 'react';
import { Filter, Search } from 'lucide-react';

export interface DashboardFilterState {
  searchQuery: string;
  eventGroup: string;
  squad: string;
  status: string;
}

interface FilterBarProps {
  filters: DashboardFilterState;
  onFilterChange: (filters: DashboardFilterState) => void;
  squadOptions: string[];
  theme?: 'bright' | 'dark';
}

export function FilterBar({ filters, onFilterChange, squadOptions, theme = 'bright' }: FilterBarProps) {
  const isBright = theme === 'bright';
  return (
    <div
      className={`p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
        isBright
          ? 'bg-white border border-slate-200/90 shadow-sm text-slate-900'
          : 'bg-[#0e0e13] border border-slate-800 shadow-xl text-white'
      }`}
    >
      {/* Search Input */}
      <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search athlete by name, code or event..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className={`w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs rounded-lg placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-colors ${
            isBright
              ? 'bg-slate-50 border border-slate-200 text-slate-900'
              : 'bg-slate-950 border border-slate-800 text-white'
          }`}
        />
      </div>

      {/* Dropdown Filters (Solid 2-col on mobile, flex row on desktop) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Event Group */}
        <select
          value={filters.eventGroup}
          onChange={(e) => onFilterChange({ ...filters, eventGroup: e.target.value })}
          className={`w-full sm:w-auto px-2.5 py-2 sm:py-1.5 text-xs rounded-lg font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden transition-colors ${
            isBright
              ? 'bg-slate-50 border border-slate-200 text-slate-800'
              : 'bg-slate-950 border border-slate-800 text-slate-200'
          }`}
        >
          <option value="all">All Event Groups</option>
          <option value="sprints">Sprints</option>
          <option value="hurdles">Hurdles</option>
          <option value="jumps">Jumps</option>
          <option value="throws">Throws</option>
          <option value="combined">Combined Events</option>
          <option value="middle_distance">Middle Distance</option>
          <option value="long_distance">Long Distance</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className={`w-full sm:w-auto px-2.5 py-2 sm:py-1.5 text-xs rounded-lg font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden transition-colors ${
            isBright
              ? 'bg-slate-50 border border-slate-200 text-slate-800'
              : 'bg-slate-950 border border-slate-800 text-slate-200'
          }`}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="rehabilitation">Rehabilitation</option>
          <option value="off-season">Off-Season</option>
          <option value="retired">Retired</option>
        </select>

        {/* Squad (Takes full width on mobile row 2) */}
        <select
          value={filters.squad}
          onChange={(e) => onFilterChange({ ...filters, squad: e.target.value })}
          className={`col-span-2 sm:col-span-1 w-full sm:w-auto px-2.5 py-2 sm:py-1.5 text-xs rounded-lg font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden transition-colors ${
            isBright
              ? 'bg-slate-50 border border-slate-200 text-slate-800'
              : 'bg-slate-950 border border-slate-800 text-slate-200'
          }`}
        >
          <option value="all">All Training Squads</option>
          {squadOptions.map((sq) => (
            <option key={sq} value={sq}>
              {sq}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
