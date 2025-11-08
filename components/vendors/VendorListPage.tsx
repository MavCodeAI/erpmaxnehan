import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { Vendor } from '../../types';
import { Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, Building2 } from 'lucide-react';
import Modal from '../ui/Modal';

interface VendorListPageProps {
    vendors: Vendor[];
    onDelete: (vendorId: string) => void;
}

const VendorListPage: React.FC<VendorListPageProps> = ({ vendors, onDelete }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());
    const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const vendorPayables = useMemo(() => {
        // This is a placeholder for a real payables calculation
        const payablesMap = new Map<string, number>();
        vendors.forEach(v => {
            payablesMap.set(v.id, v.openingBalance + Math.random() * 50000);
        });
        return payablesMap;
    }, [vendors]);

    const filteredVendors = useMemo(() =>
        vendors.filter(vendor =>
            vendor.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.workPhone.toLowerCase().includes(searchTerm.toLowerCase())
        ), [vendors, searchTerm]);

    const paginatedVendors = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredVendors.slice(start, end);
    }, [filteredVendors, currentPage, itemsPerPage]);

    const handleSelectVendor = (vendorId: string) => {
        const newSelection = new Set(selectedVendors);
        if (newSelection.has(vendorId)) {
            newSelection.delete(vendorId);
        } else {
            newSelection.add(vendorId);
        }
        setSelectedVendors(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allVendorIds = new Set(paginatedVendors.map(c => c.id));
            setSelectedVendors(allVendorIds);
        } else {
            setSelectedVendors(new Set());
        }
    };

    const confirmDelete = () => {
        if (vendorToDelete) {
            onDelete(vendorToDelete.id);
            setVendorToDelete(null);
        }
    };
    
    const isAllSelected = selectedVendors.size > 0 && paginatedVendors.every(v => selectedVendors.has(v.id));

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">All Vendors</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Vendors"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <Button variant="primary" icon={Plus} onClick={() => navigate('/purchases/vendors/new')}>New</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="col-span-4 flex items-center">
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-4" />
                        NAME
                    </div>
                    <div className="col-span-3">EMAIL</div>
                    <div className="col-span-3">WORK PHONE</div>
                    <div className="col-span-2 text-right">PAYABLES (PKR)</div>
                </div>

                <div>
                    {filteredVendors.length === 0 ? (
                        <div className="px-6 py-12">
                            <EmptyState
                                icon={Building2}
                                title="No vendors found"
                                description={searchTerm ? `No vendors match "${searchTerm}". Try adjusting your search.` : "You haven't added any vendors yet. Add your first vendor to get started."}
                                actionLabel={!searchTerm ? "Add Vendor" : undefined}
                                onAction={!searchTerm ? () => navigate('/purchases/vendors/new') : undefined}
                            />
                        </div>
                    ) : (
                        paginatedVendors.map(vendor => {
                            const payable = vendorPayables.get(vendor.id) || 0;
                            return (
                                <div key={vendor.id} className="grid grid-cols-12 px-4 py-3 items-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 group text-sm">
                                    <div className="col-span-4 flex items-center">
                                        <input type="checkbox" checked={selectedVendors.has(vendor.id)} onChange={() => handleSelectVendor(vendor.id)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-4" />
                                        <span className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer" onClick={() => navigate(`/purchases/vendors/${vendor.id}`)}>{vendor.displayName}</span>
                                    </div>
                                    <div className="col-span-3 text-gray-600 dark:text-gray-400 truncate">{vendor.email}</div>
                                    <div className="col-span-3 text-gray-600 dark:text-gray-400">{vendor.workPhone}</div>
                                    <div className="col-span-2 text-right flex items-center justify-end">
                                        <span className="font-mono text-gray-700 dark:text-gray-300">{payable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 flex space-x-1">
                                             <Button size="sm" variant="secondary" icon={Edit} title="Edit" onClick={() => navigate(`/purchases/vendors/${vendor.id}`)} />
                                             <Button size="sm" variant="danger" icon={Trash2} title="Delete" onClick={() => setVendorToDelete(vendor)} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {filteredVendors.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredVendors.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredVendors.length}
                    onItemsPerPageChange={(newSize) => {
                        setItemsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                />
            )}

            {vendorToDelete && (
                <Modal 
                    isOpen={!!vendorToDelete}
                    onClose={() => setVendorToDelete(null)}
                    title="Confirm Deletion"
                    size="md"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete vendor <strong>{vendorToDelete.displayName}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-8 space-x-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setVendorToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="danger" size="lg" onClick={confirmDelete}>Delete Vendor</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default VendorListPage;
