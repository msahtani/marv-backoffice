import React, { useState, useEffect } from 'react';
import { Upload, Download, Search, Check, X, Edit, Trash2, ChevronLeft, ChevronRight, UserCircle, Mail, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTourists, createTourist } from '../store/slices/touristSlice';
import toast from 'react-hot-toast';

interface Tourist {
  firstName: string;
  lastName: string;
  email: string;
  lastActive: number;
  loggedIn: boolean;
  purchases: number;
}

function Tourists() {
  const dispatch = useAppDispatch();
  const { tourists, loading, error } = useAppSelector((state) => state.tourists);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDownloaded, setFilterDownloaded] = useState<'all' | 'yes' | 'no'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [newTourist, setNewTourist] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const itemsPerPage = 5;

  const formatLastActive = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    dispatch(fetchTourists());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleEditTourist = (tourist: Tourist) => {
    setEditingTourist(tourist);
    setShowAddModal(true);
  };

  const handleDeleteTourist = (index: number) => {
    if (confirm('Are you sure you want to delete this tourist?')) {
      // TODO: Implement delete functionality with API
      toast.error('Delete functionality not implemented yet');
    }
  };

  const handleAddTourist = async () => {
    if (!newTourist.firstName || !newTourist.lastName || !newTourist.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(createTourist(newTourist)).unwrap();
      setShowAddModal(false);
      setNewTourist({ firstName: '', lastName: '', email: '' });
      toast.success('Tourist added successfully');
    } catch (error) {
      toast.error(error as string);
    }
  };

  const filteredTourists = tourists.filter(tourist => {
    const fullName = `${tourist.firstName} ${tourist.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      tourist.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDownloaded = 
      filterDownloaded === 'all' ||
      (filterDownloaded === 'yes' && tourist.loggedIn) ||
      (filterDownloaded === 'no' && !tourist.loggedIn);

    return matchesSearch && matchesDownloaded;
  });

  const pageCount = Math.ceil(filteredTourists.length / itemsPerPage);
  const paginatedTourists = filteredTourists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tourists Management</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setEditingTourist(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-white bg-red-900 hover:bg-red-800"
          >
            <Upload className="mr-2" size={20} />
            Add Tourist
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2" size={20} />
            Import CSV
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-0"
          />
        </div>
        <select
          value={filterDownloaded}
          onChange={(e) => setFilterDownloaded(e.target.value as 'all' | 'yes' | 'no')}
          className="px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:outline-none focus:border-red-500 focus:ring-0"
        >
          <option value="all">All Downloads</option>
          <option value="yes">Downloaded</option>
          <option value="no">Not Downloaded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  App Downloaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTourists.map((tourist, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tourist.firstName} {tourist.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tourist.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tourist.loggedIn ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X size={12} className="mr-1" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tourist.purchases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastActive(tourist.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditTourist(tourist)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTourist(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredTourists.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredTourists.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: pageCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === idx + 1
                        ? 'z-10 bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Tourist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add New Tourist
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTourist({ firstName: '', lastName: '', email: '' });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={newTourist.firstName}
                      onChange={(e) => setNewTourist({ ...newTourist, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-300 shadow-sm focus:outline-none focus:border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={newTourist.lastName}
                      onChange={(e) => setNewTourist({ ...newTourist, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-300 shadow-sm focus:outline-none focus:border-gray-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={newTourist.email}
                    onChange={(e) => setNewTourist({ ...newTourist, email: e.target.value })}
                    placeholder="Enter tourist email"
                    className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-300 shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTourist({ firstName: '', lastName: '', email: '' });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTourist}
                  className="px-6 py-2 bg-red-900 text-white rounded-xl hover:bg-red-800 transition-colors duration-200 flex items-center"
                >
                  <Plus className="mr-2" size={18} />
                  Add Tourist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tourists;