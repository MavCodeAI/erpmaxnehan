import { Account, AllTransactions } from '../types';

/**
 * Calculates the current balance of an account up to a given date.
 * This function iterates through all relevant transactions to compute a live balance.
 * @param accountId The ID of the account to calculate the balance for.
 * @param accounts The list of all accounts.
 * @param transactions An object containing all transaction arrays.
 * @param endDate The cutoff date for the calculation.
 * @returns The calculated balance.
 */
export const getAccountBalance = (accountId: string, accounts: Account[], transactions: AllTransactions, endDate: string): number => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return 0;

    let balance = account.openingBalance;
    const isDebitNature = ['Asset', 'Expense'].includes(account.type);

    const updateBalance = (debit: number, credit: number) => {
        if (isDebitNature) {
            balance += debit - credit;
        } else {
            balance += credit - debit;
        }
    };

    // Journal Vouchers
    transactions.journalVouchers.forEach(jv => {
        if (jv.date < endDate) {
            jv.entries.forEach(entry => {
                if (entry.accountId === accountId) {
                    updateBalance(entry.debit, entry.credit);
                }
            });
        }
    });

    // Sales Invoices -> Affects AR and Sales
    const salesAccount = accounts.find(a => a.code === '4-01-001'); // Product Sales
    const arAccount = accounts.find(a => a.code === '1-01-002-001'); // Accounts Receivable - Trade
    transactions.invoices.forEach(inv => {
        if (inv.date < endDate) {
            if (accountId === arAccount?.id) {
                updateBalance(inv.total, 0);
            }
            if (accountId === salesAccount?.id) {
                updateBalance(0, inv.total);
            }
        }
    });

    // Customer Payments -> Affects Cash/Bank and AR
    transactions.customerPayments.forEach(p => {
        if (p.date < endDate) {
            if (accountId === arAccount?.id) {
                updateBalance(0, p.amount);
            }
            // Logic for cash/bank depends on p.paymentMethod. Simplified for mock.
            const bankAccount = accounts.find(a => a.code === '1-01-001-002'); // Cash at Bank
            if (accountId === bankAccount?.id && p.paymentMethod === 'Bank Transfer') {
                updateBalance(p.amount, 0);
            }
        }
    });
    
    // Purchase Bills -> Affects AP and Expense/Inventory
    const cogsAccount = accounts.find(a => a.code === '5-01-001'); // COGS
    const apAccount = accounts.find(a => a.code === '2-01-001-001'); // Accounts Payable - Trade
    transactions.bills.forEach(bill => {
        if(bill.date < endDate) {
            if (accountId === apAccount?.id) {
                updateBalance(0, bill.total);
            }
            // Simplified: assuming all purchases are COGS
            if (accountId === cogsAccount?.id) {
                updateBalance(bill.total, 0);
            }
        }
    });
    
    // Vendor Payments -> Affects Cash/Bank and AP
    transactions.vendorPayments.forEach(p => {
        if (p.date < endDate) {
            if(accountId === apAccount?.id) {
                updateBalance(p.amount, 0);
            }
            // Simplified: assume from bank
            const bankAccount = accounts.find(a => a.code === '1-01-001-002');
             if (accountId === bankAccount?.id && p.paymentMethod === 'Bank Transfer') {
                updateBalance(0, p.amount);
            }
        }
    });
    
    const cashInHandAccount = accounts.find(a => a.code === '1-01-001-001');

    // Cash Payments
    transactions.cashPayments.forEach(cp => {
        if (cp.date < endDate) {
            if (accountId === cashInHandAccount?.id) {
                updateBalance(0, cp.totalAmount);
            } else {
                cp.entries.forEach(entry => {
                    if (entry.accountId === accountId) {
                        updateBalance(entry.amount, 0);
                    }
                });
            }
        }
    });

    // Cash Receipts
    transactions.cashReceipts.forEach(cr => {
        if (cr.date < endDate) {
            if (accountId === cashInHandAccount?.id) {
                updateBalance(cr.totalAmount, 0);
            } else {
                cr.entries.forEach(entry => {
                    if (entry.accountId === accountId) {
                        updateBalance(0, entry.amount);
                    }
                });
            }
        }
    });
    
    // Bank Payments
    transactions.bankPayments.forEach(bp => {
        if(bp.date < endDate) {
            if(accountId === bp.bankAccountId) {
                updateBalance(0, bp.totalAmount);
            } else {
                bp.entries.forEach(entry => {
                    if(entry.accountId === accountId) {
                        updateBalance(entry.amount, 0);
                    }
                });
            }
        }
    });
    
    // Bank Receipts
    transactions.bankReceipts.forEach(br => {
        if(br.date < endDate) {
            if(accountId === br.bankAccountId) {
                updateBalance(br.totalAmount, 0);
            } else {
                br.entries.forEach(entry => {
                    if(entry.accountId === accountId) {
                        updateBalance(0, entry.amount);
                    }
                });
            }
        }
    });
        
    return balance;
};