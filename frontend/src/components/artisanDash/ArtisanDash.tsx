import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  Package,
  DollarSign,
  Plus,
  Filter,
  ChevronDown,
  Heart,
  Clock,
  Search, 

} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    completedOrders: 0,
    averageRating: 0,
  });
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    document.title = 'Dashboard - Rarely';
  }, []);

  // Fetch stats for the artisan
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/users/stats/${user._id}`
        );
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    if (user._id) fetchStats();
  }, [user._id]);

  // Fetch the most recent order for the user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = 'https://rarely.onrender.com/api/orders/user';
        if (user && user._id) {
          url += `/${user._id}?limit=1`;
        }
        const response = await axios.get(url);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user._id) fetchOrders();
  }, [user._id]);

  // Fetch the most recent review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let res;
        if (user.role === 'artisan') {
          res = await axios.get(
            `https://rarely.onrender.com/api/reviews/artisan/${user._id}/products?limit=1`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          res = await axios.get(
            `https://rarely.onrender.com/api/reviews/artisan/${user._id}?limit=1`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user._id && token) fetchReviews();
  }, [user._id, token]);

  // Build an array from the fetched stats for the Stats Grid.
  const defaultStats = [
    {
      label: 'Total Sales',
      value: `$${stats.totalSales}`,
      icon: DollarSign,
      color: 'bg-amber-500',
      trend: '+12.5%',
      textColor: 'text-amber-500',
    },
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: Package,
      color: 'bg-emerald-500',
      trend: '+3',
      textColor: 'text-emerald-500',
    },
    {
      label: 'Reviews',
      value: (stats?.averageRating ?? 0).toFixed(1) + ' ★',
      icon: Star,
      color: 'bg-blue-500',
      trend: reviews.length ? `+${reviews.length}` : '',
      textColor: 'text-blue-500',
    },
    {
      label: 'Products',
      value: '56',
      icon: ShoppingBag,
      color: 'bg-purple-500',
      trend: '+5',
      textColor: 'text-purple-500',
    },
  ];

  // Build Recent Activity using only the latest order and review
  const activities = [];
  if (orders.length > 0) {
    const order = orders[0];
    activities.push({
      id: order._id,
      title: 'New Order Received',
      subtitle: `Order #${order._id} • $${order.totalAmount}`,
      time: new Date(order.createdAt).toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-amber-500',
      status: order.status || 'Pending',
    });
  }
  if (reviews.length > 0) {
    const review = reviews[0];
    activities.push({
      id: review._id,
      title: 'New 5-Star Review',
      subtitle: `For ${review.productName} - ${review.rating} ★`,
      time: new Date(review.createdAt).toLocaleString(),
      icon: Star,
      color: 'bg-blue-500',
      status: 'New',
    });
  }

  const quickActions = [
    { label: 'Add Product', icon: Plus, color: 'bg-indigo-500', to: '/my-products' },
    { label: 'View Orders', icon: Package, color: 'bg-pink-500', to: '/orders' },
    { label: 'Check Reviews', icon: Star, color: 'bg-yellow-500', to: '/reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search and Filter Dropdown */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Artisan!</h1>
              <p className="mt-2 text-gray-600">Here's a quick overview of your performance today.</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar (static for now) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Today</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">This Week</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">This Month</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`${action.color} text-white p-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity duration-200`}
              >
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid  gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {defaultStats.map((stat) => (
            <div
              key={stat.label}
              className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`${stat.color} p-6 h-full`}>
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 bg-opacity-30 rounded-xl">
                    <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-white text-opacity-80">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-white">{stat.value}</dd>
                    <dd className="text-sm font-medium text-white text-opacity-90 mt-1">{stat.trend}</dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link to="/reviews" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center">
                    <div className={`${activity.color} p-3 rounded-xl`}>
                      <activity.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.subtitle}</p>
                      <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
