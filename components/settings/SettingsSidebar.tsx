import React from 'react';
import { NavLink } from 'react-router-dom';
import { SETTINGS_NAV_STRUCTURE } from '../../constants';

const SettingsSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Settings</h2>
        <nav className="space-y-6">
          {SETTINGS_NAV_STRUCTURE.map((category) => (
            <div key={category.id}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {category.label}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
