import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Your Reviews</h2>
      <div className="space-y-6">
        {[1, 2, 3].map((review) => (
          <div key={review} className="border border-gray-100 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < 4 ? "fill-[#FFB636] text-[#FFB636]" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-gray-700 text-lg">Great product! Exactly as described. The craftsmanship is exceptional.</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <p>Posted on March {review}, 2024</p>
              <p>Product: Handcrafted Ceramic Bowl</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;