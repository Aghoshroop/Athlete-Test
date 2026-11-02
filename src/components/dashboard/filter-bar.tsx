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
}

export function FilterBar({ filters, onFilterChange, squadOptions }: FilterBarProps) {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search athlete by name, code or event..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Event Group */}
        <select
          value={filters.eventGroup}
          onChange={(e) => onFilterChange({ ...filters, eventGroup: e.target.value })}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
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

        {/* Squad */}
        <select
          value={filters.squad}
          onChange={(e) => onFilterChange({ ...filters, squad: e.target.value })}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
        >
          <option value="all">All Training Squads</option>
          {squadOptions.map((sq) => (
            <option key={sq} value={sq}>
              {sq}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="rehabilitation">Rehabilitation</option>
          <option value="injured">Injured</option>
          <option value="off-season">Off-Season</option>
        </select>
      </div>
    </div>
  );
}
