import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USERS_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {  
  const { user, setUser } = useContext(UserContext); 
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();
  
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();  
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {  
    localStorage.clear();
    setUser(null);  
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USERS_DATA
      );
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)]  bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5 ">
        <div className="relative">
          <img
            src={user?.profileImageUrl || "https://via.placeholder.com/80"}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>
        
        {user?.role === "admin" && (
          <div className="text-xs text-center text-blue-600 font-semibold mb-2">
            Admin
          </div>
        )}
        
        <h5 className="font-medium text-gray-950 leading-6 mt-3">
          {user?.name || "User"}
        </h5>
        
        <p className=" text-[12px] text-gray-500 ">
          {user?.email || user?.mail || ""}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] transition-colors ${
              activeMenu === item.label
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600" 
                : "text-gray-700 hover:bg-gray-50"
            } py-3 px-6 mb-1 cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;