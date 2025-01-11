import { Home, Users, Calendar, DollarSign, Users2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Membros", path: "/members" },
    { icon: Calendar, label: "Eventos", path: "/events" },
    { icon: DollarSign, label: "Finanças", path: "/finances" },
    { icon: Users2, label: "Células", path: "/cells" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 p-4 fixed left-0 top-0 slide-in">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center mb-8 pt-4">
          <h1 className="text-2xl font-bold text-primary">BeChurch</h1>
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
            <p className="text-sm text-gray-500">© 2024 BeChurch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;