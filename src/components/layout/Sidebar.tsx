import { Home, Users, Calendar, DollarSign, Users2, Menu, X, Grid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Membros", path: "/members" },
    { icon: Grid, label: "Departamentos", path: "/departments" },
    { icon: Calendar, label: "Eventos", path: "/events" },
    { icon: DollarSign, label: "Finanças", path: "/finances" },
    { icon: Users2, label: "Células", path: "/cells" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
        )}

        <div className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-center mb-8 pt-4 space-y-2">
              <img 
                src="https://i.postimg.cc/Vks5Jbh2/onlychurch-sem-fundo.png" 
                alt="OnlyChurch Logo" 
                className="w-32 h-32 object-contain"
              />
              <h1 className="text-2xl font-bold text-primary">OnlyChurch</h1>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={toggleSidebar}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto pb-4">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-500">© 2024 OnlyChurch</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 p-4 fixed left-0 top-0 slide-in">
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center mb-8 pt-4 space-y-2">
          <img 
            src="https://i.postimg.cc/Vks5Jbh2/onlychurch-sem-fundo.png" 
            alt="OnlyChurch Logo" 
            className="w-32 h-32 object-contain"
          />
          <h1 className="text-2xl font-bold text-primary">OnlyChurch</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pb-4">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500">© 2024 OnlyChurch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;