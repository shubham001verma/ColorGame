import { forwardRef, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { navbarLinks } from "@/constants";

import { IoGameControllerOutline } from "react-icons/io5";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { UserProfile } from "../components/UserProfile";
import API_BASE_URL from "../components/Config";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const [role, setRole] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();
  const userId = sessionStorage.getItem("useridcolorapp");
const addMargin = true;
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/singleuser/${userId}`);
        setRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const links = role === "admin" ? navbarLinks.Admin : navbarLinks.Admin; // Adjust as needed

  useEffect(() => {
    const openByPath = () => {
      const updatedDropdowns = {};
      links.forEach((link) => {
        if (
          link.children?.some((child) =>
            location.pathname.startsWith(child.path)
          )
        ) {
          updatedDropdowns[link.label] = true;
        }
      });
      setOpenDropdowns((prev) => ({ ...prev, ...updatedDropdowns }));
    };

    openByPath();
  }, [location.pathname, links]);

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white transition-all dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3 items-center">
  {!collapsed && (
    <>
      <img
        src="/1.png"
        className="w-35 h-7 ml-10 dark:hidden"
        alt="Light mode logo"
      />
      <img
        src="/3.png"
        className="w-35 h-7 ml-10 hidden dark:block"
        alt="Dark mode logo"
      />
    </>
  )}
</div>


      <div className="flex flex-col flex-grow px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const hasChildren = Array.isArray(link.children);
          const isOpen = openDropdowns[link.label];

          if (hasChildren) {
            return (
              <div key={link.label}>
                <div
                  onClick={() => toggleDropdown(link.label)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer font-medium group transition-all",
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                    collapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="text-lg" />
                    {!collapsed && <span>{link.label}</span>}
                  </div>
                  {!collapsed &&
                    (isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </div>

                {isOpen && !collapsed && (
                  <div className="ml-5 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.label}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-md transition-all",
                            isActive
                              ? "bg-primary text-white shadow-sm font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium"
                          )
                        }
                      >
                        {child.icon && <child.icon className="w-5 h-5" />}
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all font-medium group",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                  collapsed && "justify-center"
                )
              }
            >
              <link.icon className="text-lg" />
              {!collapsed && <span className="ml-3">{link.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {!collapsed && (
        <div className="mt-auto flex justify-center mb-4">
          <UserProfile />
        </div>
      )}
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
