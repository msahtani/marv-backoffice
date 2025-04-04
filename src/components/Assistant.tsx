import React, { useState } from 'react';
import { Send, MessagesSquare, Mail, Phone, Clock, MapPin } from 'lucide-react';

type FeedbackType = 'support' | 'feedback' | 'information';

function Assistant() {
  const [activeTab, setActiveTab] = useState<FeedbackType>('support');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    type: 'support',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ subject: '', message: '', type: 'support' });
  };

  const contactInfo = {
    email: 'support@moroccoview.com',
    phone: '+212 5XX-XXXXXX',
    hours: '9:00 AM - 6:00 PM (GMT+1)',
    address: 'Avenue Mohammed V, Marrakech, Morocco',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-50 rounded-xl">
                <MessagesSquare className="text-red-900" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Hours</p>
                  <p className="text-sm text-gray-600">{contactInfo.hours}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6">
              {[
                { id: 'support', label: 'Get Support' },
                { id: 'information', label: 'Request Info' },
                { id: 'feedback', label: 'Send Feedback' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FeedbackType)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-red-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Please describe your issue or feedback in detail..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-white bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Send className="mr-2" size={20} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistant;