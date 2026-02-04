
import React, { useState } from 'react';
import { Donor, Expense } from '../types';
import { Plus, Trash2, LogOut, Users, Wallet, Calendar } from 'lucide-react';

interface AdminPanelProps {
  donors: Donor[];
  expenses: Expense[];
  onAddDonor: (donor: Omit<Donor, 'id'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onRemoveDonor: (id: string) => void;
  onRemoveExpense: (id: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  donors,
  expenses,
  onAddDonor,
  onAddExpense,
  onRemoveDonor,
  onRemoveExpense,
  onLogout
}) => {
  const getToday = () => new Date().toISOString().split('T')[0];

  const [donorForm, setDonorForm] = useState({ name: '', date: getToday(), amount: '' });
  const [expenseForm, setExpenseForm] = useState({ name: '', amount: '' });

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (donorForm.name && donorForm.date && donorForm.amount) {
      onAddDonor({
        name: donorForm.name,
        date: donorForm.date,
        amount: Number(donorForm.amount)
      });
      setDonorForm({ name: '', date: getToday(), amount: '' });
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseForm.name && expenseForm.amount) {
      onAddExpense({
        name: expenseForm.name,
        amount: Number(expenseForm.amount)
      });
      setExpenseForm({ name: '', amount: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Console</h2>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mt-1">Foundation Management</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white hover:bg-gray-900 transition-all"
        >
          <LogOut size={16} /> Finish Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Donor Management */}
        <div className="space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-900"><Users size={20} /></div>
              <h3 className="text-lg md:text-xl font-bold">New Entry</h3>
            </div>
            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Legal Name"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-medium"
                value={donorForm.name}
                onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-medium text-gray-500 cursor-default"
                    value={donorForm.date}
                    readOnly
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar size={14} className="text-gray-400" />
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="Sum ($)"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-bold"
                  value={donorForm.amount}
                  onChange={(e) => setDonorForm({ ...donorForm, amount: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-100"
              >
                <Plus size={18} /> Record Deposit
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction Log</h4>
            </div>
            <ul className="divide-y divide-gray-50 max-h-[300px] md:max-h-[400px] overflow-y-auto">
              {donors.length === 0 ? (
                <li className="p-10 text-center text-gray-300 italic text-sm">No entries recorded</li>
              ) : donors.map((donor) => (
                <li key={donor.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="overflow-hidden pr-2">
                    <p className="font-bold text-gray-900 text-sm truncate">{donor.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{donor.date}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-bold text-gray-900 text-sm">${donor.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => onRemoveDonor(donor.id)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expense Management */}
        <div className="space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-900"><Wallet size={20} /></div>
              <h3 className="text-lg md:text-xl font-bold">New Disbursement</h3>
            </div>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Allocation Purpose"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-medium"
                value={expenseForm.name}
                onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Allocation Amount ($)"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-bold"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              />
              <button
                type="submit"
                className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all"
              >
                <Plus size={18} /> Confirm Disbursement
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Disbursement History</h4>
            </div>
            <ul className="divide-y divide-gray-50 max-h-[300px] md:max-h-[400px] overflow-y-auto">
              {expenses.length === 0 ? (
                <li className="p-10 text-center text-gray-300 italic text-sm">No disbursements logged</li>
              ) : expenses.map((expense) => (
                <li key={expense.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <p className="font-bold text-gray-900 text-sm truncate pr-2">{expense.name}</p>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-bold text-gray-500 text-sm">${expense.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => onRemoveExpense(expense.id)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
