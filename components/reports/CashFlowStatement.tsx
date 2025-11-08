
import React from 'react';
import { AllTransactions, DrilldownState } from '../../types';

interface CashFlowStatementProps extends AllTransactions {
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ invoices, bills, startDate, endDate }) => {
    
    // NOTE: This is a highly simplified cash flow calculation for demonstration purposes.
    // A real cash flow statement requires complex adjustments for non-cash items (e.g., depreciation)
    // and changes in working capital accounts.

    const netIncome = 25000; // Mocked Net Income for the period
    
    // Operating Activities
    const cashFromSales = invoices.filter(i => i.status === 'Paid' && i.date >= startDate && i.date <= endDate).reduce((sum, i) => sum + i.total, 0);
    const cashPaidToSuppliers = bills.filter(b => b.status === 'Paid' && b.date >= startDate && b.date <= endDate).reduce((sum, b) => sum + b.total, 0);
    const otherOperatingExpenses = 5000; // Mocked
    const netCashFromOperating = netIncome + cashFromSales - cashPaidToSuppliers - otherOperatingExpenses;

    // Investing Activities
    const purchaseOfEquipment = -10000; // Mocked
    const netCashFromInvesting = purchaseOfEquipment;

    // Financing Activities
    const ownerInvestment = 15000; // Mocked
    const ownerDrawings = -5000; // Mocked
    const netCashFromFinancing = ownerInvestment + ownerDrawings;
    
    const netCashFlow = netCashFromOperating + netCashFromInvesting + netCashFromFinancing;
    const beginningCashBalance = 20000; // Mocked
    const endingCashBalance = beginningCashBalance + netCashFlow;

    const renderRow = (label: string, amount: number, isSub: boolean = false, isTotal: boolean = false) => (
        <tr className={isTotal ? 'font-semibold border-t-2 dark:border-gray-600' : ''}>
            <td className={`py-2 px-4 ${isSub ? 'pl-8' : ''}`}>{label}</td>
            <td className="py-2 px-4 text-right">{amount !== null ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) : ''}</td>
        </tr>
    );

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Cash Flow Statement</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>

            <table className="w-full text-sm max-w-3xl mx-auto">
                <tbody className="divide-y dark:divide-gray-700">
                    {/* Operating Activities */}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50"><td colSpan={2} className="py-2 px-4">Cash Flow from Operating Activities</td></tr>
                    {renderRow("Net Income", netIncome, true)}
                    {renderRow("Receipts from Customers", cashFromSales, true)}
                    {renderRow("Payments to Suppliers", -cashPaidToSuppliers, true)}
                    {renderRow("Other Operating Expenses", -otherOperatingExpenses, true)}
                    {renderRow("Net Cash from Operating Activities", netCashFromOperating, false, true)}
                    
                    <tr><td colSpan={2} className="py-2">&nbsp;</td></tr>

                    {/* Investing Activities */}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50"><td colSpan={2} className="py-2 px-4">Cash Flow from Investing Activities</td></tr>
                    {renderRow("Purchase of Equipment", purchaseOfEquipment, true)}
                    {renderRow("Net Cash from Investing Activities", netCashFromInvesting, false, true)}

                    <tr><td colSpan={2} className="py-2">&nbsp;</td></tr>

                    {/* Financing Activities */}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50"><td colSpan={2} className="py-2 px-4">Cash Flow from Financing Activities</td></tr>
                     {renderRow("Owner's Investment", ownerInvestment, true)}
                     {renderRow("Owner's Drawings", ownerDrawings, true)}
                    {renderRow("Net Cash from Financing Activities", netCashFromFinancing, false, true)}
                </tbody>
                <tfoot>
                     <tr className="font-bold text-lg bg-gray-100 dark:bg-gray-800 border-t-4 dark:border-gray-600">
                         <td className="py-3 px-4">Net Increase in Cash</td>
                         <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(netCashFlow)}</td>
                    </tr>
                    <tr className="font-semibold bg-gray-50 dark:bg-gray-700/50">
                        <td className="py-2 px-4">Beginning Cash Balance</td>
                        <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(beginningCashBalance)}</td>
                    </tr>
                     <tr className="font-bold text-lg bg-gray-100 dark:bg-gray-800 border-y-2 dark:border-gray-600">
                         <td className="py-3 px-4">Ending Cash Balance</td>
                         <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(endingCashBalance)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default CashFlowStatement;
