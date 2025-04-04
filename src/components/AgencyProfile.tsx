import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Camera, CreditCard } from 'lucide-react';
import { getUserInfo } from '../services/authService';

function AgencyProfile() {
  const [agency, setAgency] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    rib: 'MA123 4567 8901 2345 6789 0123',
    description: 'Leading travel agency specializing in authentic Moroccan experiences.',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=128&h=128',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedAgency, setEditedAgency] = useState(agency);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setAgency(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone_number,
        address: userInfo.address
      }));
      setEditedAgency(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone_number,
        address: userInfo.address
      }));
    }
  }, []);

  const handleSave = () => {
    setAgency(editedAgency);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Agency Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header/Cover Image */}
        <div className="h-32 bg-gradient-to-r from-red-900 to-pink-500"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Image */}
          <div className="relative -mt-16 mb-6">
            <img
              src={agency.image}
              alt={agency.name}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-2 bg-red-900 rounded-full text-white hover:bg-red-800">
                <Camera size={20} />
              </button>
            )}
          </div>

          {/* Agency Information */}
          <div className="space-y-6">
            {isEditing ? (
              // Edit Form
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                  <input
                    type="text"
                    value={editedAgency.name}
                    onChange={(e) => setEditedAgency({...editedAgency, name: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editedAgency.email}
                    onChange={(e) => setEditedAgency({...editedAgency, email: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={editedAgency.phone}
                    onChange={(e) => setEditedAgency({...editedAgency, phone: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={editedAgency.address}
                    onChange={(e) => setEditedAgency({...editedAgency, address: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">RIB (Bank Account)</label>
                  <input
                    type="text"
                    value={editedAgency.rib}
                    onChange={(e) => setEditedAgency({...editedAgency, rib: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editedAgency.description}
                    onChange={(e) => setEditedAgency({...editedAgency, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-900 text-white rounded-xl hover:bg-red-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // Display Information
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{agency.name}</h2>
                    <p className="text-gray-500 mt-1">{agency.description}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-red-900 text-white rounded-xl hover:bg-red-800"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={20} />
                      <span className="text-gray-600">{agency.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={20} />
                      <span className="text-gray-600">{agency.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={20} />
                      <span className="text-gray-600">{agency.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="text-gray-400" size={20} />
                      <span className="text-gray-600">{agency.rib}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyProfile;