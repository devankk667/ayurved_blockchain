import React from 'react';
import { Home, Activity, BarChart2, Settings, ChevronRight } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'track', label: 'Track Batch', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0 p-4 flex flex-col">
      <div className="flex items-center mb-8 p-4">
        <div className="bg-indigo-600 p-2 rounded-lg mr-3">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold">AyurTrack</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 bg-slate-700/30 rounded-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
            <span className="text-white font-medium">U</span>
          </div>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
