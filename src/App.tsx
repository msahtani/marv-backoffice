import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Receipt, 
  LogOut,
  Menu,
  X,
  MessagesSquare,
  UserCircle
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Tourists from './components/Tourists';
import Performance from './components/Performance';
import Invoices from './components/Invoices';
import Assistant from './components/Assistant';
import AgencyProfile from './components/AgencyProfile';
import { getStoredTokens, getUserInfo, clearTokens } from './services/authService';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const { accessToken } = getStoredTokens();
    return !!accessToken;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Double check the token on mount
    const { accessToken } = getStoredTokens();
    setIsAuthenticated(!!accessToken);
    if (accessToken) {
      const info = getUserInfo();
      setUserInfo(info);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const mainNavigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Tourists', icon: Users, path: '/tourists' },
    { name: 'Performance', icon: TrendingUp, path: '/performance' },
    { name: 'Invoices', icon: Receipt, path: '/invoices' },
    { name: 'Assistant', icon: MessagesSquare, path: '/assistant' },
  ];

  const agencyInfo = {
    name: userInfo?.name || "Atlas Travel Co.",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=64&h=64",
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full bg-white shadow-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`
          fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:w-64 w-3/4
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-red-900">Morocco View</h1>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <div className="space-y-1">
                {mainNavigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                      ${isActive 
                        ? 'bg-red-50 text-red-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Agency Profile & Logout */}
            <div className="p-4 border-t border-gray-200">
              <NavLink
                to="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive
                    ? 'bg-red-50 text-red-900'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <img
                    src={agencyInfo.image}
                    alt={agencyInfo.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {agencyInfo.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Travel Agency
                    </p>
                  </div>
                </div>
                <UserCircle size={20} />
              </NavLink>
              <button
                onClick={() => {
                  clearTokens();
                  setIsAuthenticated(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:ml-64 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tourists" element={<Tourists />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/profile" element={<AgencyProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;