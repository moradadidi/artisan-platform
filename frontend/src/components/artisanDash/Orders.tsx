import React from 'react';

const Orders = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((order) => (
          <div key={order} className="border border-gray-100 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">Order #{order}23456</p>
                <p className="text-gray-500 mt-1">Placed on March {order}, 2024</p>
                <p className="text-gray-700 mt-2">3 items • Total: $149.97</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  order === 1 ? 'bg-blue-100 text-blue-800' : 
                  order === 2 ? 'bg-[#FFF8E7] text-[#FFB636]' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {order === 1 ? 'Processing' : order === 2 ? 'Shipped' : 'Delivered'}
                </span>
                <button className="block mt-3 text-[#FFB636] hover:text-[#F5A623]">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;