import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { SETTINGS_NAV_STRUCTURE } from '../../constants';
import { SettingsNavCategory } from '../../types';
import { ChevronRight } from 'lucide-react';

const SettingsSidebar: React.FC = () => {
    const location = useLocation();
    const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
        const currentCategory = SETTINGS_NAV_STRUCTURE.find(cat => 
            cat.items.some(item => location.pathname.startsWith(item.path))
        );
        return new Set(currentCategory ? [currentCategory.id] : []);
    });

    const toggleCategory = (id: string) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800 p-4">
            <nav className="space-y-4">
                {SETTINGS_NAV_STRUCTURE.map((category: SettingsNavCategory) => (
                    <div key={category.id}>
                        <button 
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex justify-between items-center py-2 px-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                            <span>{category.label}</span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${openCategories.has(category.id) ? 'rotate-90' : ''}`} />
                        </button>
                        {openCategories.has(category.id) && (
                            <ul className="mt-2 pl-3 space-y-1">
                                {category.items.map(item => (
                                    <li key={item.id}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `block w-full text-left px-3 py-2 text-sm rounded-md ${
                                                    isActive 
                                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300' 
                                                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};


const SettingsLayout: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm -my-8 -mx-6 h-[calc(100vh-64px)] flex">
        <SettingsSidebar />
        <main className="flex-1 overflow-y-auto">
             <div className="p-8">
                <Outlet />
            </div>
        </main>
    </div>
  );
};

export default SettingsLayout;
