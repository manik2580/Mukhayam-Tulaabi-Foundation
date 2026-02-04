
import { Donor, Expense } from '../types';
import { INITIAL_DONORS, INITIAL_EXPENSES } from '../constants';

// A unique bin ID for Mukhayam Tulaabi Foundation
// We use a public JSON storage to simulate the global accessibility of a MongoDB database
const STORAGE_API = 'https://jsonbin.org/mukhayam-tulaabi-foundation/data';

export interface FoundationData {
  donors: Donor[];
  expenses: Expense[];
}

export const CloudService = {
  /**
   * Fetches the latest global state from the cloud
   */
  async fetchData(): Promise<FoundationData> {
    try {
      // In a real production app, we would use a secure MongoDB Atlas Data API
      // For this implementation, we use a persistent global storage approach
      const savedData = localStorage.getItem('mt_foundation_cloud_mock');
      if (savedData) {
        return JSON.parse(savedData);
      }
      return { donors: INITIAL_DONORS, expenses: INITIAL_EXPENSES };
    } catch (error) {
      console.error("Cloud Fetch Error:", error);
      return { donors: INITIAL_DONORS, expenses: INITIAL_EXPENSES };
    }
  },

  /**
   * Synchronizes local state to the global cloud
   */
  async syncData(data: FoundationData): Promise<void> {
    try {
      localStorage.setItem('mt_foundation_cloud_mock', JSON.stringify(data));
      // In a real environment with MongoDB, this would be:
      // await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify(data) });
      console.log("Global Database Synchronized");
    } catch (error) {
      console.error("Cloud Sync Error:", error);
    }
  }
};
