
export interface Donor {
  id: string;
  name: string;
  date: string;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface AppState {
  donors: Donor[];
  expenses: Expense[];
  isAdmin: boolean;
}
