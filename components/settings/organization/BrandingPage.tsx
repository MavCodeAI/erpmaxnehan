import React, { useState } from 'react';
import Button from '../../ui/Button';
import { useTheme } from '../../../hooks/useTheme';
import { Upload, Image, Palette, Type, Layout, Save } from 'lucide-react';
import Card from '../../ui/Card';
import { showToast } from '../../../utils/toast';

const BrandingPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [companyName, setCompanyName] = useState('ERPMAX');
    const [tagline, setTagline] = useState('Your Business Management Solution');
    const [primaryColor, setPrimaryColor] = useState('#3B82F6');
    const [hasChanges, setHasChanges] = useState(false);

    const handleSave = () => {
        showToast.success('Branding settings saved successfully!');
        setHasChanges(false);
    };

    const handleLogoUpload = () => {
        showToast.info('Logo upload functionality coming soon!');
    };

    const colorPresets = [
        { name: 'Blue', color: '#3B82F6' },
        { name: 'Indigo', color: '#6366F1' },
        { name: 'Purple', color: '#8B5CF6' },
        { name: 'Pink', color: '#EC4899' },
        { name: 'Red', color: '#EF4444' },
        { name: 'Orange', color: '#F97316' },
        { name: 'Amber', color: '#F59E0B' },
        { name: 'Green', color: '#10B981' },
        { name: 'Teal', color: '#14B8A6' },
        { name: 'Cyan', color: '#06B6D4' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Branding & Appearance</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your organization's look and feel</p>
                </div>
                {hasChanges && (
                    <Button variant="primary" icon={Save} onClick={handleSave}>
                        Save Changes
                    </Button>
                )}
            </div>

            {/* Company Identity */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Company Identity</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => {
                                    setCompanyName(e.target.value);
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter company name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={tagline}
                                onChange={(e) => {
                                    setTagline(e.target.value);
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter company tagline"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Logo Upload */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Organization Logo</h3>
                    </div>
                    
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg shadow-lg">
                            <span className="text-white text-3xl font-bold">EM</span>
                        </div>
                        
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Upload your company logo. This will be displayed in invoices, reports, and email notifications.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="primary" icon={Upload} onClick={handleLogoUpload}>
                                    Upload Logo
                                </Button>
                                <Button variant="secondary">
                                    Remove
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                Recommended: 512x512px, PNG or SVG format, max 2MB
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Theme Selection */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Theme Preference</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                            onClick={() => theme === 'dark' && toggleTheme()} 
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                                theme === 'light' 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                        >
                            <div className="w-full h-32 bg-white rounded-lg shadow-md p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <p className="font-medium text-gray-700">Light Mode</p>
                                <p className="text-xs text-gray-500 mt-1">Clean and bright interface</p>
                            </div>
                            {theme === 'light' && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        
                        <div 
                            onClick={() => theme === 'light' && toggleTheme()} 
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                                theme === 'dark' 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                        >
                            <div className="w-full h-32 bg-gray-800 rounded-lg shadow-md p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                    <div className="flex-1 h-4 bg-gray-600 rounded"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <p className="font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Easy on the eyes</p>
                            </div>
                            {theme === 'dark' && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Color Palette */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Primary Color</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Choose a primary color for buttons, links, and highlights throughout the application.
                    </p>
                    
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                        {colorPresets.map((preset) => (
                            <button
                                key={preset.color}
                                onClick={() => {
                                    setPrimaryColor(preset.color);
                                    setHasChanges(true);
                                    showToast.success(`Primary color changed to ${preset.name}`);
                                }}
                                className={`group relative w-12 h-12 rounded-lg transition-transform hover:scale-110 ${
                                    primaryColor === preset.color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 scale-110' : ''
                                }`}
                                style={{ 
                                    backgroundColor: preset.color,
                                    boxShadow: primaryColor === preset.color ? `0 0 0 2px ${preset.color}` : 'none'
                                }}
                                title={preset.name}
                            >
                                {primaryColor === preset.color && (
                                    <svg className="absolute inset-0 m-auto w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-4 flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Custom Color:
                        </label>
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => {
                                setPrimaryColor(e.target.value);
                                setHasChanges(true);
                            }}
                            className="w-16 h-10 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {primaryColor.toUpperCase()}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Preview */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Preview</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EM</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{companyName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{tagline}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Primary Button
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                                Secondary Button
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BrandingPage;
