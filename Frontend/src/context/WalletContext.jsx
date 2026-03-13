import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(1000); // Initial dummy balance
    const [transactions, setTransactions] = useState([]);
    const [coupons, setCoupons] = useState([
        { id: 'STAY10', code: 'STAY10', discount: 10, description: '10% off on your first booking' },
        { id: 'LUXE20', code: 'LUXE20', discount: 20, description: '20% off on suites' }
    ]);

    const addFunds = (amount) => {
        setBalance(prev => prev + amount);
        setTransactions(prev => [{
            id: Date.now(),
            type: 'credit',
            amount,
            date: new Date().toISOString(),
            description: 'Funds Added'
        }, ...prev]);
    };

    const deductFunds = (amount, description) => {
        if (balance >= amount) {
            setBalance(prev => prev - amount);
            setTransactions(prev => [{
                id: Date.now(),
                type: 'debit',
                amount,
                date: new Date().toISOString(),
                description: description || 'Booking Payment'
            }, ...prev]);
            return true;
        }
        return false;
    };

    return (
        <WalletContext.Provider value={{ balance, transactions, coupons, addFunds, deductFunds }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
