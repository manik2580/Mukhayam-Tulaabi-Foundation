
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Visualization from './components/Visualization';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { Donor, Expense } from './types';
import { ADMIN_PIN } from './constants';
import { CloudService } from './services/db';
import { ArrowLeft, Activity, Globe, RefreshCcw, Landmark, ReceiptText } from 'lucide-react';

const App: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Initial load from the Global Cloud Database
  useEffect(() => {
    const loadGlobalData = async () => {
      setIsLoading(true);
      const data = await CloudService.fetchData();
      setDonors(data.donors);
      setExpenses(data.expenses);
      setIsLoading(false);
    };
    loadGlobalData();
  }, []);

  // Sync to Cloud whenever data changes (if initialized)
  useEffect(() => {
    if (!isLoading) {
      const sync = async () => {
        setIsSyncing(true);
        await CloudService.syncData({ donors, expenses });
        setIsSyncing(false);
      };
      sync();
    }
  }, [donors, expenses, isLoading]);

  const totalDonations = useMemo(() => donors.reduce((sum, d) => sum + d.amount, 0), [donors]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const handleLogin = (pin: string) => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setLoginError('');
    } else {
      setLoginError('Invalid security code');
    }
  };

  const addDonor = (newDonor: Omit<Donor, 'id'>) => {
    setDonors([{ ...newDonor, id: Date.now().toString() }, ...donors]);
  };

  const removeDonor = (id: string) => {
    setDonors(donors.filter(d => d.id !== id));
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses([{ ...newExpense, id: Date.now().toString() }, ...expenses]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Connecting to Foundation Database</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-gray-900 selection:text-white">
      {/* Live Sync Status Bar */}
      <div className="bg-gray-50/50 py-2 border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-emerald-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Global Live Portal</span>
          </div>
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <RefreshCcw size={10} className="text-gray-400 animate-spin" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Database Synced</span>
          </div>
        </div>
      </div>

      <Header />

      <main className="pb-12 md:pb-24">
        {isAdmin ? (
          <AdminPanel
            donors={donors}
            expenses={expenses}
            onAddDonor={addDonor}
            onAddExpense={addExpense}
            onRemoveDonor={removeDonor}
            onRemoveExpense={removeExpense}
            onLogout={() => setIsAdmin(false)}
          />
        ) : showAdminLogin ? (
          <div className="container mx-auto px-4 py-8 md:py-20">
            <button 
              onClick={() => { setShowAdminLogin(false); setLoginError(''); }} 
              className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} /> Back to View
            </button>
            <AdminLogin onLogin={handleLogin} error={loginError} />
          </div>
        ) : (
          <div className="container mx-auto px-4 mt-8 md:mt-12">
            <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
              
              {/* 1. Visualization Section */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center mb-10 md:mb-16">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">Financial Clarity</h2>
                  <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto px-4 font-light">
                    Real-time global synchronization of every dollar donated and spent by the Mukhayam Tulaabi Foundation.
                  </p>
                </div>
                <div className="max-w-4xl mx-auto px-2">
                  <Visualization totalDonations={totalDonations} totalExpenses={totalExpenses} />
                </div>
              </section>

              {/* Public Dashboard Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 pt-8 border-t border-gray-50">
                {/* 2. Donor Contributions Section */}
                <section>
                  <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Benefactors</h2>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Inflow Stream</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="px-4 md:px-6 py-4 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Donor</th>
                            <th className="px-4 md:px-6 py-4 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {donors.length === 0 ? (
                            <tr><td colSpan={2} className="px-6 py-10 text-center text-gray-300 text-xs italic">Awaiting donor contributions...</td></tr>
                          ) : donors.slice(0, 10).map((donor) => (
                            <tr key={donor.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="px-4 md:px-6 py-4 md:py-5">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{donor.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase mt-0.5">{new Date(donor.date).toLocaleDateString()}</p>
                              </td>
                              <td className="px-4 md:px-6 py-4 md:py-5 text-sm font-bold text-gray-900 text-right">
                                ${donor.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-900 text-white">
                          <tr>
                            <td className="px-4 md:px-6 py-5 md:py-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">Total Pooled</td>
                            <td className="px-4 md:px-6 py-5 md:py-8 text-xl md:text-2xl font-bold text-right tracking-tight">
                              ${totalDonations.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </section>

                {/* 3. Allocation Section */}
                <section>
                  <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Allocations</h2>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Social Impact</span>
                  </div>
                  <div className="space-y-4">
                    {expenses.length === 0 ? (
                       <div className="p-10 border border-dashed border-gray-100 rounded-2xl text-center text-gray-300 text-xs">No allocations logged yet.</div>
                    ) : expenses.slice(0, 8).map((expense) => (
                      <div key={expense.id} className="relative bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center group overflow-hidden transition-all hover:border-gray-300 shadow-sm hover:shadow-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-50 group-hover:bg-gray-900 transition-colors"></div>
                        <div className="flex flex-col gap-0.5 ml-1 overflow-hidden">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-gray-900 transition-colors">Allocation ID: #{expense.id.slice(-4)}</span>
                          <span className="text-sm md:text-base font-bold text-gray-900 truncate">{expense.name}</span>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-[10px] text-gray-300 uppercase tracking-tighter mb-0.5">Disbursed</p>
                          <span className="text-sm md:text-lg font-bold text-gray-900">
                            ${expense.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Disbursed Capital Card - Premium Redesign */}
                    <div className="mt-12 relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-[2.5rem] blur opacity-30"></div>
                      <div className="relative bg-gray-900 p-10 md:p-14 rounded-[2.5rem] text-white overflow-hidden shadow-2xl">
                        {/* Abstract Background Element */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="mb-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <Landmark size={20} className="text-white opacity-80" />
                          </div>
                          
                          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.4em] mb-3">
                            Total Disbursed Capital
                          </p>
                          
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl md:text-3xl font-light text-gray-500">$</span>
                            <h3 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                              {totalExpenses.toLocaleString()}
                            </h3>
                          </div>
                          
                          <div className="mt-8 pt-8 border-t border-white/10 w-full flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <ReceiptText size={16} className="text-emerald-500