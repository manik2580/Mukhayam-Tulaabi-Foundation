// ===== Global State Management =====
let appState = {
    donors: [],
    expenses: [],
    isAdmin: false,
    isLoading: true,
    isSyncing: false,
};

const ADMIN_PIN = '5022';

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[v0] App initializing...');
    
    // Check authentication status
    await checkAuthStatus();
    
    // Load initial data
    await loadData();
    
    // Render the app
    renderApp();
    
    // Setup event listeners
    setupEventListeners();
});

// ===== API Calls =====
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        appState.isAdmin = data.isAdmin;
    } catch (error) {
        console.error('[v0] Error checking auth:', error);
    }
}

async function loadData() {
    try {
        appState.isLoading = true;
        const response = await fetch('/api/data');
        const data = await response.json();
        appState.donors = data.donors;
        appState.expenses = data.expenses;
        console.log('[v0] Data loaded:', data);
    } catch (error) {
        console.error('[v0] Error loading data:', error);
    } finally {
        appState.isLoading = false;
    }
}

async function login(pin) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin }),
        });
        const data = await response.json();
        
        if (response.ok) {
            appState.isAdmin = true;
            renderApp();
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('[v0] Login error:', error);
        return { success: false, error: 'Login failed' };
    }
}

async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        appState.isAdmin = false;
        renderApp();
    } catch (error) {
        console.error('[v0] Logout error:', error);
    }
}

async function addDonor(name, date, amount) {
    try {
        appState.isSyncing = true;
        renderSyncBar();
        
        const response = await fetch('/api/donors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, date, amount: Number(amount) }),
        });
        const newDonor = await response.json();
        
        appState.donors.unshift(newDonor);
        renderApp();
        appState.isSyncing = false;
        renderSyncBar();
    } catch (error) {
        console.error('[v0] Error adding donor:', error);
        appState.isSyncing = false;
        renderSyncBar();
    }
}

async function removeDonor(id) {
    try {
        appState.isSyncing = true;
        renderSyncBar();
        
        await fetch(`/api/donors/${id}`, { method: 'DELETE' });
        appState.donors = appState.donors.filter(d => d._id !== id);
        renderApp();
        appState.isSyncing = false;
        renderSyncBar();
    } catch (error) {
        console.error('[v0] Error removing donor:', error);
        appState.isSyncing = false;
        renderSyncBar();
    }
}

async function addExpense(name, amount) {
    try {
        appState.isSyncing = true;
        renderSyncBar();
        
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, amount: Number(amount) }),
        });
        const newExpense = await response.json();
        
        appState.expenses.unshift(newExpense);
        renderApp();
        appState.isSyncing = false;
        renderSyncBar();
    } catch (error) {
        console.error('[v0] Error adding expense:', error);
        appState.isSyncing = false;
        renderSyncBar();
    }
}

async function removeExpense(id) {
    try {
        appState.isSyncing = true;
        renderSyncBar();
        
        await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        appState.expenses = appState.expenses.filter(e => e._id !== id);
        renderApp();
        appState.isSyncing = false;
        renderSyncBar();
    } catch (error) {
        console.error('[v0] Error removing expense:', error);
        appState.isSyncing = false;
        renderSyncBar();
    }
}

// ===== Calculations =====
function getTotalDonations() {
    return appState.donors.reduce((sum, d) => sum + (d.amount || 0), 0);
}

function getTotalExpenses() {
    return appState.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    }).format(Math.round(num));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

// ===== Rendering =====
function renderApp() {
    const app = document.getElementById('app');
    
    if (appState.isLoading) {
        app.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p class="loading-text">Connecting to Foundation Database</p>
            </div>
        `;
        return;
    }
    
    app.innerHTML = `
        ${renderSyncBar()}
        ${renderHeader()}
        <main class="pb-12 md:pb-24">
            ${appState.isAdmin ? renderAdminPanel() : renderPublicDashboard()}
        </main>
    `;
    
    setupEventListeners();
}

function renderSyncBar() {
    return `
        <div class="sync-bar">
            <div class="sync-bar-content">
                <div class="sync-badge">
                    <i class="fas fa-globe" style="color: ${appState.isSyncing ? '#9ca3af' : '#10b981'}; font-size: 12px;"></i>
                    <span class="uppercase font-bold text-xs tracking-widest" style="color: #059669; opacity: ${appState.isSyncing ? '0.5' : '1'}; transition: opacity 0.3s;">
                        ${appState.isSyncing ? 'Syncing...' : 'Global Live Portal'}
                    </span>
                </div>
                <div class="sync-badge">
                    ${appState.isSyncing 
                        ? `<i class="fas fa-sync-alt animate-spin" style="color: #9ca3af; font-size: 10px;"></i>` 
                        : `<div class="sync-dot"></div>`
                    }
                    <span class="uppercase font-bold text-xs tracking-widest text-gray-400">Database Synced</span>
                </div>
            </div>
        </div>
    `;
}

function renderHeader() {
    return `
        <header class="header">
            <div class="header-content">
                <h1 class="header-title text-5xl">Mukhayam Tulaabi Foundation</h1>
                <p class="header-subtitle">Advancing Humanity Through Radical Transparency</p>
                <div class="header-divider"></div>
            </div>
        </header>
    `;
}

function renderPublicDashboard() {
    const totalDonations = getTotalDonations();
    const totalExpenses = getTotalExpenses();
    
    return `
        <div class="container mx-auto px-4">
            <div class="max-w-6xl mx-auto space-y-16 md:space-y-24 page-space">
                <!-- Visualization Section -->
                <section>
                    <div class="text-center mb-10 md:mb-16">
                        <h2 class="text-2xl md:text-4xl font-bold mb-4">Financial Clarity</h2>
                        <p class="text-sm md:text-base text-gray-500 max-w-lg mx-auto px-4 font-light">
                            Real-time global synchronization of every dollar donated and spent by the Mukhayam Tulaabi Foundation.
                        </p>
                    </div>
                    <div class="max-w-4xl mx-auto px-2">
                        ${renderVisualization(totalDonations, totalExpenses)}
                    </div>
                </section>

                <!-- Dashboard Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 pt-8 border-t border-gray-50">
                    <!-- Benefactors Section -->
                    <section>
                        <div class="flex-between mb-6 md:mb-10 px-2">
                            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Benefactors</h2>
                            <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">Inflow Stream</span>
                        </div>
                        <div class="card">
                            <div class="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Donor</th>
                                            <th class="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${appState.donors.length === 0 
                                            ? `<tr><td colspan="2" class="text-center text-gray-300 text-xs italic py-10">Awaiting donor contributions...</td></tr>`
                                            : appState.donors.slice(0, 10).map(donor => `
                                                <tr>
                                                    <td>
                                                        <p class="text-sm font-semibold text-gray-900">${donor.name}</p>
                                                        <p class="text-xs text-gray-400 uppercase mt-1">${formatDate(donor.date)}</p>
                                                    </td>
                                                    <td class="text-right text-sm font-bold text-gray-900">$${formatCurrency(donor.amount)}</td>
                                                </tr>
                                            `).join('')
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td class="text-xs font-bold uppercase tracking-widest">Total Pooled</td>
                                            <td class="text-right text-2xl font-bold">${formatCurrency(totalDonations)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </section>

                    <!-- Allocations Section -->
                    <section>
                        <div class="flex-between mb-6 md:mb-10 px-2">
                            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Allocations</h2>
                            <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">Social Impact</span>
                        </div>
                        <div class="space-y-4">
                            ${appState.expenses.length === 0 
                                ? `<div class="empty-state">No allocations logged yet.</div>`
                                : appState.expenses.slice(0, 8).map(expense => `
                                    <div class="list-item relative">
                                        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: #f3f4f6;"></div>
                                        <div class="list-item-content ml-1">
                                            <span class="text-xs uppercase tracking-widest text-gray-400 font-bold">Allocation ID: #${expense._id.slice(-4)}</span>
                                            <span class="text-sm md:text-base font-bold text-gray-900 block">${expense.name}</span>
                                        </div>
                                        <div class="text-right ml-4 flex-shrink-0">
                                            <p class="text-xs text-gray-300 uppercase tracking-tighter mb-1">Disbursed</p>
                                            <span class="text-sm md:text-lg font-bold text-gray-900">$${formatCurrency(expense.amount)}</span>
                                        </div>
                                    </div>
                                `).join('')
                            }
                            
                            <!-- Disbursed Capital Card -->
                            <div class="mt-12 relative">
                                <div class="card card-dark">
                                    <div class="card-dark-blur"></div>
                                    <div class="card-dark-content py-14 px-10">
                                        <div class="icon-circle">
                                            <i class="fas fa-landmark" style="font-size: 20px; opacity: 0.8;"></i>
                                        </div>
                                        
                                        <p class="text-xs md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            Total Disbursed Capital
                                        </p>
                                        
                                        <div class="flex items-baseline gap-1 justify-center">
                                            <span class="text-2xl md:text-3xl font-light text-gray-500">$</span>
                                            <h3 class="text-6xl md:text-7xl font-bold tracking-tight">${formatCurrency(totalExpenses)}</h3>
                                        </div>
                                        
                                        <div class="mt-8 pt-8 border-t border-white border-opacity-10 w-full flex flex-col md:flex-row items-center justify-center gap-4">
                                            <div class="flex items-center gap-3">
                                                <i class="fas fa-receipt" style="color: #10b981; font-size: 16px;"></i>
                                                <span class="text-xs md:text-sm font-semibold text-white">${appState.expenses.length} Total Allocations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        
        <!-- Admin Login Modal (if not logged in) -->
        <button id="admin-btn-public" class="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg">
            <i class="fas fa-lock mr-2"></i> Admin Access
        </button>
    `;
}

function renderAdminPanel() {
    return `
        <div class="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Console</h2>
                    <p class="text-sm text-gray-400 uppercase tracking-widest font-semibold mt-1">Foundation Management</p>
                </div>
                <button id="logout-btn" class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white hover:bg-gray-900 transition-all">
                    <i class="fas fa-sign-out-alt"></i> Finish Session
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                <!-- Donor Management -->
                <div class="space-y-6 md:space-y-10">
                    <div class="card">
                        <div class="flex items-center gap-3 mb-8">
                            <div class="icon-wrapper">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="text-lg md:text-xl font-bold">New Entry</h3>
                        </div>
                        <form id="donor-form" class="space-y-4">
                            <input type="text" id="donor-name" placeholder="Full Legal Name" required>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="date" id="donor-date" required readonly style="cursor: default;">
                                <input type="number" id="donor-amount" placeholder="Sum ($)" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-full">
                                <i class="fas fa-plus"></i> Record Deposit
                            </button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-subtitle">Transaction Log</h4>
                        </div>
                        <ul class="divide-y max-h-[400px] overflow-y-auto">
                            ${appState.donors.length === 0 
                                ? `<li class="p-10 text-center text-gray-300 italic text-sm">No entries recorded</li>`
                                : appState.donors.map(donor => `
                                    <li class="list-item">
                                        <div class="list-item-content pr-2">
                                            <p class="list-item-title">${donor.name}</p>
                                            <p class="list-item-meta">${formatDate(donor.date)}</p>
                                        </div>
                                        <div class="list-item-actions">
                                            <span class="list-item-amount">$${formatCurrency(donor.amount)}</span>
                                            <button class="btn-danger delete-donor" data-id="${donor._id}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </li>
                                `).join('')
                            }
                        </ul>
                    </div>
                </div>

                <!-- Expense Management -->
                <div class="space-y-6 md:space-y-10">
                    <div class="card">
                        <div class="flex items-center gap-3 mb-8">
                            <div class="icon-wrapper">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <h3 class="text-lg md:text-xl font-bold">New Disbursement</h3>
                        </div>
                        <form id="expense-form" class="space-y-4">
                            <input type="text" id="expense-name" placeholder="Allocation Purpose" required>
                            <input type="number" id="expense-amount" placeholder="Allocation Amount ($)" required>
                            <button type="submit" class="btn btn-secondary w-full">
                                <i class="fas fa-plus"></i> Confirm Disbursement
                            </button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-subtitle">Disbursement History</h4>
                        </div>
                        <ul class="divide-y max-h-[400px] overflow-y-auto">
                            ${appState.expenses.length === 0 
                                ? `<li class="p-10 text-center text-gray-300 italic text-sm">No disbursements logged</li>`
                                : appState.expenses.map(expense => `
                                    <li class="list-item">
                                        <p class="list-item-title pr-2 truncate">${expense.name}</p>
                                        <div class="list-item-actions">
                                            <span class="list-item-amount" style="color: #6b7280;">$${formatCurrency(expense.amount)}</span>
                                            <button class="btn-danger delete-expense" data-id="${expense._id}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </li>
                                `).join('')
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderVisualization(totalDonations, totalExpenses) {
    const maxValue = Math.max(totalDonations, totalExpenses) * 1.2 || 100;
    const donationHeight = (totalDonations / maxValue) * 80;
    const expenseHeight = (totalExpenses / maxValue) * 80;
    
    return `
        <div class="chart-container">
            <h3 class="chart-title">Financial Overview</h3>
            <div class="flex items-end justify-center gap-12 h-full pt-4">
                <div class="flex flex-col items-center">
                    <div style="height: ${donationHeight}%; width: 60px; background-color: #1a1a1a; border-radius: 6px 6px 0 0; margin-bottom: 1rem;"></div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Donations</p>
                    <p class="text-lg font-bold text-gray-900">$${formatCurrency(totalDonations)}</p>
                </div>
                <div class="flex flex-col items-center">
                    <div style="height: ${expenseHeight}%; width: 60px; background-color: #71717a; border-radius: 6px 6px 0 0; margin-bottom: 1rem;"></div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expenses</p>
                    <p class="text-lg font-bold text-gray-900">$${formatCurrency(totalExpenses)}</p>
                </div>
            </div>
        </div>
    `;
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Admin button (public dashboard)
    const adminBtnPublic = document.getElementById('admin-btn-public');
    if (adminBtnPublic) {
        adminBtnPublic.addEventListener('click', () => {
            showLoginModal();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Donor form
    const donorForm = document.getElementById('donor-form');
    if (donorForm) {
        const dateInput = document.getElementById('donor-date');
        dateInput.valueAsDate = new Date();
        
        donorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('donor-name').value;
            const date = document.getElementById('donor-date').value;
            const amount = document.getElementById('donor-amount').value;
            
            if (name && date && amount) {
                await addDonor(name, date, amount);
                donorForm.reset();
                dateInput.valueAsDate = new Date();
            }
        });
    }
    
    // Expense form
    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('expense-name').value;
            const amount = document.getElementById('expense-amount').value;
            
            if (name && amount) {
                await addExpense(name, amount);
                expenseForm.reset();
            }
        });
    }
    
    // Delete donor buttons
    document.querySelectorAll('.delete-donor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Delete this donor?')) {
                removeDonor(id);
            }
        });
    });
    
    // Delete expense buttons
    document.querySelectorAll('.delete-expense').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Delete this expense?')) {
                removeExpense(id);
            }
        });
    });
}

// ===== Login Modal =====
function showLoginModal() {
    const overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    
    overlay.innerHTML = `
        <div class="card max-w-md mx-auto py-8 px-4 md:py-12 md:px-6 text-center" style="width: 90%; max-width: 28rem;">
            <div class="flex items-center justify-center rounded-full mx-auto mb-6" style="width: 3.5rem; height: 3.5rem; background-color: var(--bg-gray-50);">
                <i class="fas fa-lock" style="font-size: 1.5rem; color: var(--gray-900);"></i>
            </div>
            <h2 class="text-xl md:text-2xl font-bold mb-2">Access Portal</h2>
            <p class="text-gray-400 mb-8 text-xs md:text-sm">Enter the 4-digit security code</p>
            
            <div class="space-y-6">
                <div class="relative">
                    <input 
                        type="password" 
                        id="pin-input" 
                        inputmode="numeric" 
                        maxlength="4" 
                        placeholder="••••" 
                        class="w-full px-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 outline-none text-center text-4xl tracking-widest font-bold transition-all placeholder:text-gray-200"
                        autofocus
                    >
                    <p id="pin-error" class="text-red-500 text-xs font-bold uppercase tracking-wider mt-2" style="display: none;"></p>
                </div>

                <div class="pt-4 flex justify-center gap-2">
                    <div class="pin-dot w-3 h-3 rounded-full bg-gray-100 transition-all duration-300"></div>
                    <div class="pin-dot w-3 h-3 rounded-full bg-gray-100 transition-all duration-300"></div>
                    <div class="pin-dot w-3 h-3 rounded-full bg-gray-100 transition-all duration-300"></div>
                    <div class="pin-dot w-3 h-3 rounded-full bg-gray-100 transition-all duration-300"></div>
                </div>
            </div>
            
            <div class="mt-12 pt-6 border-t border-gray-50">
                <p class="text-xs text-gray-300 uppercase tracking-wider font-bold">Secure Entry Protocol v4.0</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');
    const pinDots = document.querySelectorAll('.pin-dot');
    
    pinInput.addEventListener('input', async (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value.slice(0, 4);
        
        // Update dots
        pinDots.forEach((dot, index) => {
            if (index < value.length) {
                dot.style.backgroundColor = var('--gray-900');
                dot.style.transform = 'scale(1.1)';
            } else {
                dot.style.backgroundColor = '#f3f4f6';
                dot.style.transform = 'scale(1)';
            }
        });
        
        // Auto-submit on 4 digits
        if (value.length === 4) {
            const result = await login(value);
            if (!result.success) {
                pinError.textContent = result.error;
                pinError.style.display = 'block';
                pinInput.value = '';
                pinDots.forEach(dot => {
                    dot.style.backgroundColor = '#f3f4f6';
                    dot.style.transform = 'scale(1)';
                });
            } else {
                overlay.remove();
            }
        }
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
