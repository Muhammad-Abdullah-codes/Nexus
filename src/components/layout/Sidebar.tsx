import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Building2,
  CircleDollarSign,
  Users,
  MessageCircle,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  Calendar,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  text,
  className,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${className || ""} ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const entrepreneurItems = [
    {
      to: "/dashboard/entrepreneur",
      icon: <Home size={20} />,
      text: "Dashboard",
      className: "tour-wallet",
    },
    {
      to: "/profile/entrepreneur/" + user.id,
      icon: <Building2 size={20} />,
      text: "My Startup",
    },
    {
      to: "/investors",
      icon: <CircleDollarSign size={20} />,
      text: "Find Investors",
    },
    {
      to: "/calendar",
      icon: <Calendar size={20} />,
      text: "Calendar",
      className: "tour-calendar",
    },
    {
      to: "/messages",
      icon: <MessageCircle size={20} />,
      text: "Messages",
      className: "tour-video",
    },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    {
      to: "/documents",
      icon: <FileText size={20} />,
      text: "Documents",
      className: "tour-documents",
    },
  ];

  const investorItems = [
    {
      to: "/dashboard/investor",
      icon: <Home size={20} />,
      text: "Dashboard",
      className: "tour-wallet",
    },
    {
      to: "/profile/investor/" + user.id,
      icon: <CircleDollarSign size={20} />,
      text: "My Portfolio",
    },
    { to: "/entrepreneurs", icon: <Users size={20} />, text: "Find Startups" },
    {
      to: "/calendar",
      icon: <Calendar size={20} />,
      text: "Calendar",
      className: "tour-calendar",
    },
    {
      to: "/messages",
      icon: <MessageCircle size={20} />,
      text: "Messages",
      className: "tour-video",
    },
    { to: "/notifications", icon: <Bell size={20} />, text: "Notifications" },
    {
      to: "/deals",
      icon: <FileText size={20} />,
      text: "Deals",
      className: "tour-documents",
    },
  ];

  const sidebarItems =
    user.role === "entrepreneur" ? entrepreneurItems : investorItems;

  const commonItems = [
    {
      to: "/settings",
      icon: <Settings size={20} />,
      text: "Settings",
      className: "tour-security",
    },
    { to: "/help", icon: <HelpCircle size={20} />, text: "Help & Support" },
  ];

  return (
    // Outer div maintains the full-height background and border down the page
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block transition-colors duration-200">
      {/* Inner div now fits its contents naturally without forcing whitespace. */}
      {/* top-6 adds a slight padding from the top edge when you scroll. */}
      <div className="sticky top-6 flex flex-col">
        {/* Top Section: Links */}
        <div className="py-4 overflow-hidden">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} {...item} />
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Support Box now sits directly under Settings */}
        <div className="px-4 pb-4 transition-colors mt-2">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md p-3 transition-colors">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Need assistance?
            </p>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              Contact Support
            </h4>
            <a
              href="mailto:support@businessnexus.com"
              className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
