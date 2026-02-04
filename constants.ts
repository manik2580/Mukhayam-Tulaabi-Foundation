
import { Donor, Expense } from './types';

export const ADMIN_PIN = "5022";

export const INITIAL_DONORS: Donor[] = [
  { id: '1', name: 'Eleanor Vance', date: '2024-05-12', amount: 2500 },
  { id: '2', name: 'Julian Thorne', date: '2024-05-14', amount: 1200 },
  { id: '3', name: 'Sarah Montgomery', date: '2024-05-15', amount: 5000 },
  { id: '4', name: 'Arthur Penhaligon', date: '2024-05-18', amount: 750 },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: '1', name: 'Clean Water Initiative - Phase 1', amount: 3200 },
  { id: '2', name: 'Educational Supplies Distribution', amount: 1500 },
  { id: '3', name: 'Healthcare Mobile Clinic Fuel', amount: 450 },
];
