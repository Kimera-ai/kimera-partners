import React from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href}
      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
    >
      {children}
    </a>
  );
};

export const UserMenu = () => {
  return (
    <div className="relative">
      <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
        <img src="/placeholder.svg" alt="User" className="h-8 w-8 rounded-full" />
        <span>Partner Name</span>
        <ChevronDown size={16} />
      </button>
    </div>
  );
};

export const Navigation = () => {
  return (
    <nav className="border-b border-white/10 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">Kimera</h1>
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/partnerships">Partnerships</NavLink>
              <NavLink href="/sales-kit">Sales Kit</NavLink>
              <NavLink href="/playground">Playground</NavLink>
              <NavLink href="/marketing">Marketing</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-300 hover:text-white">
              <Bell size={20} />
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export const SectionHeader = ({ title, description }: { title: string; description?: string }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl md:text-4xl text-white mb-3">{title}</h2>
      {description && (
        <p className="text-lg text-gray-300">{description}</p>
      )}
    </div>
  );
};

export const SearchBar = () => {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="search"
        placeholder="Search resources..."
        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-[#FF2B6E] focus:border-transparent placeholder:text-gray-400"
      />
    </div>
  );
};