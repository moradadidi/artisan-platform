import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, Search, ArrowRight } from "lucide-react";

const mockSuggestions = [
  { title: "Dashboard", path: "/" },
  { title: "Products", path: "/products" },
  { title: "Login", path: "/login" },
  { title: "Sign Up", path: "/register" },
  { title: "Blog", path: "/blog" },
];

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = mockSuggestions.filter((suggestion) =>
      suggestion.title.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <AlertCircle size={64} className="text-red-500 mb-6" aria-hidden="true" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              We're sorry, but the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a page..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                aria-label="Search for a page"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} aria-hidden="true" />
            </div>
            {suggestions.length > 0 && (
              <ul className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.path} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      to={suggestion.path}
                      className="block px-4 py-3 hover:bg-gray-50 transition duration-200 ease-in-out text-gray-700 hover:text-blue-600"
                    >
                      {suggestion.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            >
              <Home className="mr-2" size={20} aria-hidden="true" />
              Go to Homepage
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            >
              Contact Support
              <ArrowRight className="ml-2" size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
