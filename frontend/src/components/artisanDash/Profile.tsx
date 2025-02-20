import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../UserAuthContext';

const Profile = () => {
  useEffect(() => {
    document.title = 'Profile - Rarely';
  }, []);
//   const user = JSON.parse(sessionStorage.getItem('user'));
  const token = sessionStorage.getItem('token');
  const fileInputRef = useRef(null);
  const {user , updateProfilePicture} = useUserAuth();
//   console.log("prof" ,user);

  // Initialize state for profile info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
  });
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Populate the form once on mount from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        bio: user.bio || '',
      });
      setProfilePicture(
        user.profilePicture ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      );
    }
  }, []); // run only once

  // Controlled input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Controlled input change for password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle submission for updating general profile info (excluding profile picture)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const updateData = { ...formData };
      if (password) {
        updateData.password = password;
      }
      // Use the correct endpoint (mounted at /api/register)
      const response = await axios.put(
        `http://127.0.0.1:5000/api/register/${user._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setMessage('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    //   sessionStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile.');
    }
    setLoading(false);
  };

  // Reset form values to those stored
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        bio: user.bio || '',
      });
      setPassword('');
      setMessage('');
    }
  };

  // Trigger hidden file input for profile picture update
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Upload new profile picture and update user record
  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const form = new FormData();
    form.append("image", file);
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/profile/upload/${user._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const imageUrl = response.data.imageUrl;
      setProfilePicture(imageUrl);
      updateProfilePicture(imageUrl);
      if (imageUrl) {
        toast.success('Profile picture updated successfully!');
      }else{
        toast.error('Try diferent image !!!.');
      }
      
      // Update user profile with new profile picture
      const updateResponse = await axios.put(
        `http://127.0.0.1:5000/api/users/${user._id}`,
        { profilePicture: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      sessionStorage.setItem("user", JSON.stringify(updateResponse.data));
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error('Try diferent image !!!.');
      setMessage("Error uploading profile picture.");
    }
  };
  
  

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={user.profilePicture ?? profilePicture} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#FFF8E7]"
            />
            <button 
              type="button"
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 p-2 bg-[#FFB636] rounded-full text-white hover:bg-[#F5A623] shadow-lg"
            >
              <Camera size={18} />
            </button>
            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">{formData.name || 'Artisan Name'}</h3>
            <p className="text-gray-600">Artisan since {user.createdAt.slice(0, 4)}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#FFF8E7] text-[#FFB636] rounded-full text-sm font-medium">
                {user.role === 'artisan' ? 'Verified Artisan' : 'Verified Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )} */}

        {/* General Profile Info Form */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea 
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea 
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFF8E7] focus:border-[#FFB636] transition-colors"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-[#FFB636] text-white rounded-lg hover:bg-[#F5A623] transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
