import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Account, DrilldownState, AllTransactions, ReportType, InventoryItem } from '../types';
import { showToast } from '../utils/toast';
import ProfitAndLoss from '../components/reports/ProfitAndLoss';
import BalanceSheet from '../components/reports/BalanceSheet';
import TrialBalance from '../components/reports/TrialBalance';
import LedgerReport from '../components/reports/LedgerReport';
import SourceDocumentViewer from '../components/reports/SourceDocumentViewer';
import SalesAndPurchasesReport from '../components/reports/SalesAndPurchasesReport';
import InventoryLedger from '../components/reports/InventoryLedger';
import Button from '../components/ui/Button';
import { ArrowLeft, Printer, FileDown, FileSpreadsheet } from 'lucide-react';
import CashFlowStatement from '../components/reports/CashFlowStatement';
import SalesByCustomer from '../components/reports/SalesByCustomer';
import SalesByItem from '../components/reports/SalesByItem';
import APARSummary from '../components/reports/APARSummary';
import GeneralLedgerSummary from '../components/reports/GeneralLedgerSummary';
import DetailedGeneralLedger from '../components/reports/DetailedGeneralLedger';
import ReportsHub from '../components/reports/ReportsHub';
import { ALL_REPORTS_STRUCTURE } from '../constants';

interface ReportsProps extends AllTransactions {
    accounts: Account[];
    inventoryItems: InventoryItem[];
}

type ViewState = { type: 'hub' } | { type: 'report', reportId: ReportType };

const Reports: React.FC<ReportsProps> = (props) => {
    const [view, setView] = useState<ViewState>({ type: 'hub' });
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2023-12-31');
    
    const [drilldownHistory, setDrilldownHistory] = useState<DrilldownState[]>([]);
    const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);
    const [title, setTitle] = useState('Reports Center');

    useEffect(() => {
        if (view.type === 'hub' || !drilldown) {
            setTitle('Reports Center');
            return;
        }
        
        const getPartName = (state: DrilldownState): string => {
            switch (state.type) {
                case 'summary':
                    return ALL_REPORTS_STRUCTURE.flatMap(c => c.reports).find(r => r.id === state.tab)?.name || 'Report';
                case 'ledger':
                    const acc = props.accounts.find(a => a.id === state.accountId);
                    return `Ledger: ${acc?.name || '...'}`;
                case 'source':
                    const typeName = state.sourceType.replace(/_/g, ' ');
                    return typeName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
        };

        const parts: string[] = [];
        
        const baseReportDrilldownState: DrilldownState = { type: 'summary', tab: view.reportId };
        parts.push(getPartName(baseReportDrilldownState));

        drilldownHistory.forEach(state => {
            if (state.type !== 'summary') {
                parts.push(getPartName(state));
            }
        });

        if (drilldown.type !== 'summary') {
            parts.push(getPartName(drilldown));
        }

        setTitle(parts.join('  >  '));

    }, [view, drilldown, drilldownHistory, props.accounts]);

    const handleSelectReport = (reportId: ReportType, newStartDate: string, newEndDate: string) => {
        if (reportId === 'placeholder') {
            showToast.info("This report is not yet available.");
            return;
        }
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setView({ type: 'report', reportId });
        setDrilldown({ type: 'summary', tab: reportId });
        setDrilldownHistory([]);
    };
    
    const handleGoBack = () => {
        const lastState = drilldownHistory[drilldownHistory.length - 1];
        if (lastState) {
            setDrilldown(lastState);
            setDrilldownHistory(prev => prev.slice(0, -1));
        } else {
            setView({ type: 'hub' });
            setDrilldown(null);
        }
    };
    
    const handleDrilldown = (nextView: DrilldownState) => {
        if(drilldown) {
            setDrilldownHistory(prev => [...prev, drilldown]);
        }
        setDrilldown(nextView);
    };

    if (view.type === 'hub') {
        return <ReportsHub onSelectReport={handleSelectReport} />;
    }

    const renderReport = () => {
        if (!drilldown) return null;

        const reportProps = { ...props, startDate, endDate, onDrilldown: handleDrilldown };
        
        switch (drilldown.type) {
            case 'summary':
                switch (view.reportId) {
                    case 'pnl': return <ProfitAndLoss {...reportProps} />;
                    case 'balance-sheet': return <BalanceSheet {...reportProps} />;
                    case 'trial-balance': return <TrialBalance {...reportProps} />;
                    case 'cash-flow': return <CashFlowStatement {...reportProps} />;
                    case 'sales-by-customer': return <SalesByCustomer {...reportProps} />;
                    case 'sales-by-item': return <SalesByItem {...reportProps} />;
                    case 'apar-summary': return <APARSummary {...reportProps} />;
                    case 'gl-summary': return <GeneralLedgerSummary {...reportProps} />;
                    case 'detailed-gl': return <DetailedGeneralLedger {...reportProps} />;
                    case 'sales-purchases': return <SalesAndPurchasesReport {...reportProps} />;
                    case 'inventory-ledger': return <InventoryLedger {...reportProps} />;
                    default: return <p>Report "{view.reportId}" not implemented.</p>;
                }
            case 'ledger':
                 return <LedgerReport {...props} accountId={drilldown.accountId} startDate={startDate} endDate={endDate} onDrilldown={handleDrilldown} />;
            case 'source':
                return <SourceDocumentViewer {...props} sourceType={drilldown.sourceType} sourceId={drilldown.sourceId} />;
            default:
                return null;
        }
    }

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <div className="flex items-center space-x-4 min-w-0">
                     <Button variant="secondary" onClick={handleGoBack} icon={ArrowLeft}>Back</Button>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 truncate" title={title}>
                        {title}
                    </h2>
                </div>
                 <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
                    <Button variant="secondary" icon={FileDown} onClick={() => showToast.info('Downloading PDF...')}>PDF</Button>
                    <Button variant="secondary" icon={FileSpreadsheet} onClick={() => showToast.info('Exporting to Excel...')}>Excel</Button>
                </div>
            </div>

            <Card>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex flex-wrap items-center gap-4 mb-6">
                     <div>
                        <label htmlFor="startDate" className="text-sm font-medium mr-2">From:</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white dark:bg-gray-700 px-3 py-2 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="text-sm font-medium mr-2">To:</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white dark:bg-gray-700 px-3 py-2 rounded-md shadow-sm" />
                    </div>
                </div>

                <div className="mt-4">
                    {renderReport()}
                </div>
            </Card>
        </>
    );
};

export default Reports;