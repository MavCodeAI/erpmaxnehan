import React, { useState, useMemo } from 'react';
import { ALL_REPORTS_STRUCTURE } from '../../constants';
import { ReportType, ReportInfo, ReportCategoryInfo } from '../../types';
import { Search, Star, Clock, Folder, BarChart2 } from 'lucide-react';
import Card from '../ui/Card';
import ScheduleReportModal from './ScheduleReportModal';

interface ReportsHubProps {
  onSelectReport: (reportId: ReportType, startDate: string, endDate: string) => void;
}

const ReportsHub: React.FC<ReportsHubProps> = ({ onSelectReport }) => {
  const [reportsData, setReportsData] = useState<ReportCategoryInfo[]>(ALL_REPORTS_STRUCTURE);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All Reports');
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');

  const handleToggleFavorite = (reportId: ReportType) => {
    setReportsData(currentData => 
      currentData.map(category => ({
        ...category,
        reports: category.reports.map(report =>
          report.id === reportId ? { ...report, isFavorite: !report.isFavorite } : report
        ),
      }))
    );
  };

  const filteredReportStructure = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (lowercasedSearchTerm) {
      return reportsData
        .map(category => ({
          ...category,
          reports: category.reports.filter(report =>
            report.name.toLowerCase().includes(lowercasedSearchTerm)
          ),
        }))
        .filter(category => category.reports.length > 0);
    }

    switch (activeCategory) {
      case 'Favorites': {
        const favoriteReports = reportsData
          .flatMap(category => category.reports)
          .filter(report => report.isFavorite);
        return [{ name: 'Favorites', reports: favoriteReports }].filter(c => c.reports.length > 0);
      }

      case 'All Reports':
        return reportsData;

      default:
        return reportsData.filter(category => category.name === activeCategory);
    }
  }, [searchTerm, activeCategory, reportsData]);
  
  const reportCategories = useMemo(() => ALL_REPORTS_STRUCTURE.map(c => c.name), []);

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const escapedHighlight = escapeRegExp(highlight.trim());
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="font-bold bg-primary-100 dark:bg-primary-500/30 rounded-sm px-1">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Reports Center
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="md:col-span-1 lg:col-span-1">
          <Card className="p-4 sticky top-8">
            <nav className="space-y-4">
              <div>
                 <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Actions</h3>
                 <ul className="mt-2 space-y-1">
                     <li>
                        <button 
                            onClick={() => setActiveCategory('Favorites')}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${activeCategory === 'Favorites' ? 'bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                        >
                           <Star className="w-5 h-5 mr-3" /> Favorites
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setScheduleModalOpen(true)}
                            className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                           <Clock className="w-5 h-5 mr-3" /> Scheduled Reports
                        </button>
                    </li>
                 </ul>
              </div>
              <div>
                <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Report Categories</h3>
                <ul className="mt-2 space-y-1">
                    <li>
                        <button
                            onClick={() => setActiveCategory('All Reports')}
                            className={`w-full text-left flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${activeCategory === 'All Reports' ? 'bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                        >
                            <Folder className="w-5 h-5 mr-3" />
                            All Reports
                        </button>
                    </li>
                    {reportCategories.map(categoryName => (
                        <li key={categoryName}>
                            <button
                                onClick={() => setActiveCategory(categoryName)}
                                className={`w-full text-left flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${activeCategory === categoryName ? 'bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                            >
                                <Folder className="w-5 h-5 mr-3" />
                                {categoryName}
                            </button>
                        </li>
                    ))}
                </ul>
              </div>
            </nav>
          </Card>
        </div>

        <div className="md:col-span-3 lg:col-span-4">
          <Card>
            <div className="p-4 border-b dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search reports"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-50 border border-gray-300 rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="fromDate" className="text-sm font-medium text-gray-600 dark:text-gray-300">From:</label>
                        <input type="date" id="fromDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input-sm"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="toDate" className="text-sm font-medium text-gray-600 dark:text-gray-300">To:</label>
                        <input type="date" id="toDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input-sm"/>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visited</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {filteredReportStructure.map(category => (
                    <React.Fragment key={category.name}>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={3} className="px-6 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {category.name} <span className="text-xs font-normal text-gray-400">({category.reports.length})</span>
                        </td>
                      </tr>
                      {category.reports.map(report => (
                        <tr key={report.id + report.name} className="border-b dark:border-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <button onClick={() => handleToggleFavorite(report.id)} title="Toggle Favorite">
                                    <Star className={`w-4 h-4 mr-2 transition-colors ${report.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`} />
                                </button>
                                <button onClick={() => onSelectReport(report.id, startDate, endDate)} className="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 text-left">
                                    {getHighlightedText(report.name, searchTerm)}
                                </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{report.lastVisited || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">System Generated</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
               {filteredReportStructure.length === 0 && (
                <div className="text-center py-16">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No Reports Found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? `Your search for "${searchTerm}" did not match any reports.` : `There are no reports in the "${activeCategory}" category.`}
                    </p>
                </div>
               )}
            </div>
          </Card>
        </div>
      </div>
      <ScheduleReportModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
      <style>{`.form-input-sm { padding: 0.5rem; font-size: 0.875rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; } .dark .form-input-sm { background-color: #374151; border-color: #4b5563; color: #d1d5db }`}</style>
    </>
  );
};

export default ReportsHub;