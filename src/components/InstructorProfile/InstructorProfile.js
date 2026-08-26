import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './InstructorProfile.css';

const InstructorProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profileImage: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.put(`${API_URL}/api/profile`, 
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/api/profile/upload-image`, 
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setProfile(prev => ({
        ...prev,
        profileImage: response.data.profileImage
      }));
      
      setSuccess('Profile image updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/profile/image`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(prev => ({
        ...prev,
        profileImage: null
      }));
      
      setSuccess('Profile image removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete image:', err);
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👨‍🏫 Instructor Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-image-section">
          <div className="image-wrapper">
            {profile.profileImage ? (
              <img 
                src={`${API_URL}${profile.profileImage}`} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                {profile.firstName && profile.lastName ? (
                  <span>{profile.firstName[0]}{profile.lastName[0]}</span>
                ) : (
                  <span>👤</span>
                )}
              </div>
            )}
          </div>
          
          <div className="image-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/jpg,image/webp"
              style={{ display: 'none' }}
            />
            <button 
              onClick={triggerFileInput} 
              className="btn-upload"
              disabled={loading}
            >
              📷 Upload Image
            </button>
            {profile.profileImage && (
              <button 
                onClick={handleDeleteImage} 
                className="btn-delete"
                disabled={loading}
              >
                🗑️ Remove
              </button>
            )}
          </div>
          <small className="image-hint">Recommended: 200x200px (max 5MB)</small>
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-mode">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleInputChange}
                  placeholder="Tell your students about yourself..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="edit-actions">
                <button 
                  onClick={handleSaveProfile} 
                  className="btn-save"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }} 
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="profile-details">
                <div className="detail-row">
                  <span className="label">Full Name:</span>
                  <span className="value">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : 'Not set'}
                  </span>
                </div>
                {profile.bio && (
                  <div className="detail-row">
                    <span className="label">Bio:</span>
                    <span className="value bio-text">{profile.bio}</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn-edit"
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;