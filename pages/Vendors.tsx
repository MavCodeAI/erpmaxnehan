import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Vendor } from '../types';
import VendorListPage from '../components/vendors/VendorListPage';
import VendorCreatePage from '../components/vendors/VendorCreatePage';

interface VendorsProps {
    vendors: Vendor[];
    onSave: (vendor: Vendor) => void;
    onDelete: (vendorId: string) => void;
}

const Vendors: React.FC<VendorsProps> = (props) => {
    return (
        <Routes>
            <Route index element={<VendorListPage {...props} />} />
            <Route path="new" element={<VendorCreatePage {...props} />} />
            <Route path=":id" element={<VendorCreatePage {...props} />} />
        </Routes>
    );
};

export default Vendors;
