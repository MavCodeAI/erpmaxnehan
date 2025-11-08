import React from 'react';
import Button from '../../ui/Button';
import { useTheme } from '../../../hooks/useTheme';

const BrandingPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-4 border-b dark:border-gray-700">Branding</h2>
            <div className="max-w-4xl space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Organization Logo</h3>
                    <div className="mt-4 flex items-center space-x-6">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-md">
                            {/* Placeholder for logo */}
                            <span className="text-gray-400">Logo</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">This logo will be displayed in transaction PDFs and email notifications.</p>
                            <Button variant="primary">Upload Logo</Button>
                            <Button variant="secondary" className="ml-2">Remove Logo</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Appearance</h3>
                    <div className="mt-4 flex space-x-4">
                        <div onClick={() => theme === 'dark' && toggleTheme()} className={`w-40 h-24 p-3 border-2 rounded-lg cursor-pointer ${theme === 'light' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            <div className="w-full h-full bg-white rounded-sm shadow-inner p-2">
                                <div className="w-1/2 h-2 bg-blue-500 rounded-sm"></div>
                            </div>
                            <p className="text-center text-sm mt-2">Light Pane</p>
                        </div>
                        <div onClick={() => theme === 'light' && toggleTheme()} className={`w-40 h-24 p-3 border-2 rounded-lg cursor-pointer ${theme === 'dark' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            <div className="w-full h-full bg-gray-800 rounded-sm shadow-inner p-2">
                                <div className="w-1/2 h-2 bg-blue-500 rounded-sm"></div>
                            </div>
                            <p className="text-center text-sm mt-2">Dark Pane</p>
                        </div>
                    </div>
                </div>

                 <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Accent Color</h3>
                     <div className="mt-4 flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-blue-600"></div>
                        <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandingPage;
