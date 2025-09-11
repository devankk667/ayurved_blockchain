import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
          activeTab === 'scan'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setActiveTab('scan')}
      >
        Scan Herb
      </button>
      <button
        className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
          activeTab === 'results'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setActiveTab('results')}
      >
        Results
      </button>
    </header>
  );
};

export default Header;
