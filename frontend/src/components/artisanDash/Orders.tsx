import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft,
  Search,
  Filter,
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from the API using axios
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        let url = 'http://127.0.0.1:5000/api/orders/user';
        if (user && user._id) {
          url += `/${user._id}`;
        }
        const response = await axios.get(url);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      processing: Clock,
      shipped: Package,
      delivered: CheckCircle,
      cancelled: AlertCircle,
      pending:Clock,
    };
    return icons[status] || Package;
  };

  const filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Pending', value: 'pending' },
  ];

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter !== 'all' && order.status !== selectedFilter) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        order.products.some((item) =>
          item.productId.name.toLowerCase().includes(searchLower)
        )
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/artisan-dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="mt-2 text-gray-600">Manage and track your customer orders</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {React.createElement(getStatusIcon(order.status), { className: "h-4 w-4" })}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    {order.customerName && (
                      <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                    )}
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.productId.name}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900">Shipping Address</h4>
                      <p className="text-gray-600 mt-1">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Payment Status</h4>
                      <p className="text-gray-600 mt-1">{order.paymentStatus}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
