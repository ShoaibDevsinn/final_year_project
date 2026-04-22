import React from 'react';

const HouseTable = ({ houses, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    if (!price) return '0 Cr';
    return `${(price / 10000000).toFixed(1)} Cr`;
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Sold: 'bg-gray-100 text-gray-800',
      Pending: 'bg-yellow-100 text-yellow-800',
    };
    return `px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.Active}`;
  };

  if (!houses || houses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROPERTY TITLE</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AREA (MARLA)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE (PKR)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BEDS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BATHS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KITCHEN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {houses.map((house) => (
            <tr key={house.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.area}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(house.price)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.beds}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.baths}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{house.kitchen}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(house.status)}>{house.status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onEdit(house)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(house.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HouseTable;