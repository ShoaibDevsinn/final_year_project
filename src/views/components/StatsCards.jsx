import React from 'react';

const StatsCards = ({ stats }) => {
  const cards = [
    { title: 'TOTAL LISTINGS', value: stats?.totalListings || 0, icon: '🏠', color: 'blue' },
    { title: 'NEW LISTINGS (This Month)', value: stats?.newListings || 0, icon: '🆕', color: 'green' },
    { title: 'PENDING REQUESTS', value: stats?.pendingRequests || 0, icon: '⏳', color: 'yellow' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
            <div className="text-4xl bg-gray-100 p-3 rounded-full">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;