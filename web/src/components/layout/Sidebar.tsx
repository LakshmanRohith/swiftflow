// path: web/src/components/layout/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { Home, Folder, CheckSquare, Calendar, BarChart2 } from 'lucide-react';

const navLinks = [
  { to: '/', icon: Home, text: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, text: 'My Tasks' },
  { to: '/projects', icon: Folder, text: 'Projects' },
  { to: '/calendar', icon: Calendar, text: 'Calendar' },
  { to: '/analytics', icon: BarChart2, text: 'Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold">SwiftFlow</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'} // Use 'end' for the Dashboard link to only be active on the exact path
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mx-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span className="ml-3">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
