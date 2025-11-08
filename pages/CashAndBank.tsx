// FIX: Implement the Cash & Bank hub page.
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowRightLeft } from 'lucide-react';

const CashAndBank: React.FC = () => {
  const voucherTypes = [
    { title: 'Cash Payments', path: '/cash-and-bank/cash-payments', description: 'Record payments made in cash.' },
    { title: 'Cash Receipts', path: '/cash-and-bank/cash-receipts', description: 'Record cash received.' },
    { title: 'Bank Payments', path: '/cash-and-bank/bank-payments', description: 'Record payments made from bank accounts.' },
    { title: 'Bank Receipts', path: '/cash-and-bank/bank-receipts', description: 'Record funds received in bank accounts.' },
  ];

  return (
    <>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Cash & Bank Transactions
      </h2>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {voucherTypes.map(voucher => (
          <Link to={voucher.path} key={voucher.path}>
            <Card className="hover:shadow-lg hover:border-primary-500 border-transparent border transition-shadow">
              <div className="flex items-center">
                <div className="p-3 mr-4 text-primary-500 bg-primary-100 rounded-full dark:text-primary-100 dark:bg-primary-500">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{voucher.title}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{voucher.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CashAndBank;
