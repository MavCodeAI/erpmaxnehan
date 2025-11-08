import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { ALL_REPORTS_STRUCTURE } from '../../constants';

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({ isOpen, onClose }) => {
    const allReports = ALL_REPORTS_STRUCTURE.flatMap(cat => cat.reports.filter(r => r.id !== 'placeholder'));

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast.success('Report scheduled successfully! (This is a demo)');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule a Report" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="report" className={labelClasses}>Report</label>
                    <select id="report" name="report" className={inputClasses} required>
                        {allReports.map(report => (
                            <option key={report.id} value={report.id}>{report.name}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="frequency" className={labelClasses}>Frequency</label>
                        <select id="frequency" name="frequency" className={inputClasses} defaultValue="Weekly">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="time" className={labelClasses}>Time of Day</label>
                        <input type="time" id="time" name="time" className={inputClasses} defaultValue="09:00" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="recipients" className={labelClasses}>Recipient Emails</label>
                    <input type="email" id="recipients" name="recipients" multiple placeholder="user1@example.com, user2@example.com" className={inputClasses} required />
                    <p className="mt-1 text-xs text-gray-500">Separate multiple emails with a comma.</p>
                </div>

                <div className="flex justify-end pt-5 space-x-3 border-t dark:border-gray-700 mt-5">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Schedule Report</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ScheduleReportModal;