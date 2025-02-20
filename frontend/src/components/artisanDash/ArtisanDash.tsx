import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  Package,
  DollarSign,
  Search,
  Plus,
  Filter,
  ChevronDown,
  Heart,
} from 'lucide-react';

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    document.title = 'Dashboard - Rarely';
  }, []);

  // If the user is a regular user, show a custom dashboard
  if (user && user.role === "user") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <img
              src={user.profilePicture || '/default-avatar.png'}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-indigo-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {user.name}!
              </h1>
              <p className="text-gray-700">
                This is your personal dashboard.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
              </div>
              <p className="mt-3 text-gray-600">
                View your order history and track shipments.
              </p>
              <Link
                to="/orders"
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                View Orders &rarr;
              </Link>
            </div>
            <div className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-800">Favorites</h2>
              </div>
              <p className="mt-3 text-gray-600">
                Check out the products you’ve marked as favorites.
              </p>
              <Link
                to="/favorites"
                className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
              >
                View Favorites &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise (artisan/admin): show the original dashboard layout

  const stats = [
    { label: 'Total Sales', value: '$2,345', icon: DollarSign, color: 'bg-amber-500', trend: '+12.5%', textColor: 'text-amber-500' },
    { label: 'Active Orders', value: '12', icon: Package, color: 'bg-emerald-500', trend: '+3', textColor: 'text-emerald-500' },
    { label: 'Reviews', value: '4.8 ★', icon: Star, color: 'bg-blue-500', trend: '+0.2', textColor: 'text-blue-500' },
    { label: 'Products', value: '56', icon: ShoppingBag, color: 'bg-purple-500', trend: '+5', textColor: 'text-purple-500' },
  ];

  const activities = [
    {
      id: 1,
      title: 'New order received',
      subtitle: 'Order #123456 • $149.99',
      time: '2 minutes ago',
      icon: ShoppingBag,
      color: 'bg-amber-500',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'New 5-star review',
      subtitle: 'For Ceramic Bowl Set',
      time: '1 hour ago',
      icon: Star,
      color: 'bg-blue-500',
      status: 'New',
    },
  ];

  const quickActions = [
    { label: 'Add Product', icon: Plus, color: 'bg-indigo-500', to: '/my-products' },
    { label: 'View Orders', icon: Package, color: 'bg-pink-500', to: '/orders' },
    { label: 'Check Reviews', icon: Star, color: 'bg-yellow-500', to: '/reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Artisan!</h1>
              <p className="mt-2 text-gray-600">Here's a quick overview of your performance today.</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
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
        <div className="grid grid-cols-4 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className={`${stat.color} p-6 h-full`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gray-100 bg-opacity-30 rounded-xl">
                      <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-white text-opacity-80">
                        {stat.label}
                      </dt>
                      <dd className="text-2xl font-semibold text-white">{stat.value}</dd>
                      <dd className="text-sm font-medium text-white text-opacity-90 mt-1">
                        {stat.trend}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out"></div>
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
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 ease-in-out"
              >
                <div className="flex items-center">
                  <div className={`${activity.color} p-3 rounded-xl`}>
                    <activity.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">{activity.subtitle}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className="ml-4">
                    <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
