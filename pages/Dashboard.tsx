import React from 'react';
import { Invoice, PurchaseBill, Account } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { Plus, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';

// Types for new components
interface DashboardProps {
    invoices: Invoice[];
    bills: PurchaseBill[];
    accounts: Account[];
}

// Reusable card component for dashboard sections
const DashboardCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>}
    {children}
  </div>
);

// Component for Total Receivables/Payables
const ReceivablesPayablesCard: React.FC<{
  title: string;
  totalUnpaid: number;
  current: number;
  overdue: number;
  isPayable?: boolean;
}> = ({ title, totalUnpaid, current, overdue, isPayable = false }) => {
  const total = current + overdue;
  const overduePercentage = total > 0 ? (overdue / total) * 100 : 0;

  return (
    <DashboardCard>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        {isPayable && <Button size="sm" variant="secondary" icon={Plus}>New</Button>}
      </div>
      <p className="text-xs text-gray-500">
        Total Unpaid {isPayable ? 'Bills' : 'Invoices'}: {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(totalUnpaid)}
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 my-3">
        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${100 - overduePercentage}%` }}></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">CURRENT</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(current)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">OVERDUE</p>
          <div className="flex items-center">
            <p className="text-xl font-semibold text-red-500">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(overdue)}</p>
            <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

// Component for Cash Flow Chart
const CashFlowChart: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const data = [
        { name: 'Jan', flow: 0 }, { name: 'Feb', flow: 0 }, { name: 'Mar', flow: 0 }, { name: 'Apr', flow: 0 },
        { name: 'May', flow: 15000 }, { name: 'Jun', flow: 35000 }, { name: 'Jul', flow: 58000 }, { name: 'Aug', flow: 83000 },
        { name: 'Sep', flow: 83000 }, { name: 'Oct', flow: 83000 }, { name: 'Nov', flow: 83000 }, { name: 'Dec', flow: 83000 },
    ];
    return (
        <DashboardCard className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cash Flow</h3>
                <div className="text-sm">This Fiscal Year <ChevronDown className="inline w-4 h-4"/></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
                            <YAxis stroke={tickColor} fontSize={12} tickFormatter={(value) => `${value/1000}K`}/>
                            <Tooltip 
                                formatter={(value: number) => new Intl.NumberFormat('en-PK').format(value)}
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                    borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                                }}
                            />
                            <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-col justify-center">
                    <div className="text-sm">Cash as on 01 Jan 2025</div>
                    <div className="text-lg font-semibold mb-2">PKR0.00</div>
                    <div className="text-sm text-green-600">Incoming</div>
                    <div className="text-lg font-semibold">+ PKR233,788.00</div>
                    <div className="text-sm text-red-600">Outgoing</div>
                    <div className="text-lg font-semibold">- PKR150,624.00</div>
                    <div className="border-t dark:border-gray-600 my-2"></div>
                    <div className="text-sm text-blue-600 font-semibold">Cash as on 31 Dec 2025</div>
                    <div className="text-lg font-bold">= PKR83,164.00</div>
                </div>
            </div>
        </DashboardCard>
    );
};

// Component for Income & Expense chart
const IncomeExpenseChart: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const data = [
        { name: 'Jan', Income: 0, Expense: 0 }, { name: 'Feb', Income: 0, Expense: 0 },
        { name: 'Mar', Income: 0, Expense: 0 }, { name: 'Apr', Income: 0, Expense: 0 },
        { name: 'May', Income: 0, Expense: 0 }, { name: 'Jun', Income: 40000, Expense: 25000 },
        { name: 'Jul', Income: 110000, Expense: 85000 }, { name: 'Aug', Income: 80000, Expense: 55000 },
        { name: 'Sep', Income: 0, Expense: 0 }, { name: 'Oct', Income: 0, Expense: 0 },
        { name: 'Nov', Income: 0, Expense: 0 }, { name: 'Dec', Income: 0, Expense: 0 },
    ];
    return (
        <DashboardCard>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Income and Expense</h3>
                <div className="text-sm">This Fiscal Year <ChevronDown className="inline w-4 h-4"/></div>
            </div>
            <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
                        <YAxis stroke={tickColor} fontSize={12} tickFormatter={(value) => `${value/1000}K`}/>
                        <Tooltip 
                            formatter={(value: number) => new Intl.NumberFormat('en-PK').format(value)} 
                            contentStyle={{
                                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                            }}
                        />
                        <Bar dataKey="Income" fill="#10b981" />
                        <Bar dataKey="Expense" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4 text-center">
                <div>
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-lg font-semibold text-green-600">PKR195,811.00</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-lg font-semibold text-red-600">PKR155,650.00</p>
                </div>
            </div>
        </DashboardCard>
    );
};

// Component for Top Expenses chart
const TopExpensesChart: React.FC = () => {
    const data = [
        { name: 'Postage by M&P', value: 6351.00, color: '#10b981' },
        { name: 'Internet Expenses', value: 3465.00, color: '#f97316' },
        { name: 'MBL CHARGES', value: 2088.00, color: '#3b82f6' },
        { name: 'Postage by Post Office', value: 690.00, color: '#f59e0b' },
        { name: 'CARRIAGE INWARD', value: 350.00, color: '#8b5cf6' },
    ];
    const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <DashboardCard>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Top Expenses</h3>
                <div className="text-sm">This Fiscal Year <ChevronDown className="inline w-4 h-4"/></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={2}>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-500">TOP EXPENSES</span>
                        <span className="font-bold text-lg">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(totalExpenses)}</span>
                    </div>
                </div>
                <div className="text-xs space-y-2">
                    {data.map(item => (
                        <div key={item.name} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span>{item.name}</span>
                            </div>
                            <span className="font-semibold">{new Intl.NumberFormat('en-PK').format(item.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardCard>
    );
};

// Component for listing Bank/Watchlist accounts
const AccountListCard: React.FC<{ title: string; accounts: Account[] }> = ({ title, accounts }) => (
    <DashboardCard title={title}>
        <div className="space-y-3">
            {accounts.length > 0 ? accounts.map(acc => (
                <div key={acc.id} className="flex justify-between items-center text-sm border-b dark:border-gray-700 pb-2 last:border-b-0">
                    <span className="text-gray-600 dark:text-gray-300">{acc.name}</span>
                    <span className="font-semibold font-mono">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(acc.openingBalance)}</span>
                </div>
            )) : <p className="text-sm text-gray-500">No accounts to display.</p>}
        </div>
    </DashboardCard>
);


const Dashboard: React.FC<DashboardProps> = ({ invoices, bills, accounts }) => {
    // Get accounts for lists
    const bankAccounts = accounts.filter(acc => acc.accountType === 'Bank' || acc.accountType === 'Cash');
    const watchlistAccounts = accounts.filter(acc => acc.isWatchlisted);
  
    return (
      <>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Welcome to ERPMAX
            </h2>
             {/* Tabs could go here */}
        </div>
        
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReceivablesPayablesCard
                    title="Total Receivables"
                    totalUnpaid={144679.00} // from screenshot
                    current={0.00} // from screenshot
                    overdue={144679.00} // from screenshot
                />
                <ReceivablesPayablesCard
                    title="Total Payables"
                    totalUnpaid={11420.00} // from screenshot
                    current={0.00} // from screenshot
                    overdue={11420.00} // from screenshot
                    isPayable
                />
            </div>

            <CashFlowChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeExpenseChart />
                <TopExpensesChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AccountListCard title="Bank and Credit Cards" accounts={bankAccounts} />
                <AccountListCard title="Account Watchlist" accounts={watchlistAccounts} />
            </div>
        </div>
      </>
    );
};

export default Dashboard;
