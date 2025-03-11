// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        transactions: JSON.parse(localStorage.getItem('transactions')) || [],
        assets: JSON.parse(localStorage.getItem('assets')) || [
            { id: 'cash', name: 'Tunai', balance: 0, type: 'cash' },
            { id: 'bank', name: 'Bank', balance: 0, type: 'bank' },
            { id: 'savings', name: 'Tabungan', balance: 0, type: 'savings' },
            { id: 'credit', name: 'Kredit', balance: 0, type: 'credit' },
            { id: 'loan', name: 'Pinjaman', balance: 0, type: 'loan' }
        ],
        showModal: false,
        editingTransactionId: null
    },
    getters: {
        income: state => {
            return state.transactions
                .filter(transaction => transaction.type === 'income')
                .reduce((total, transaction) => total + transaction.amount, 0);
        },
        expense: state => {
            return state.transactions
                .filter(transaction => transaction.type === 'expense')
                .reduce((total, transaction) => total + transaction.amount, 0) +
                state.transactions
                .filter(transaction => transaction.type === 'transfer')
                .reduce((total, transaction) => total + (transaction.adminFee || 0), 0);
        },
        balance: (state, getters) => {
            return getters.income - getters.expense;
        },
        sortedTransactions: state => {
            return [...state.transactions].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        },
        assetBalance: state => assetId => {
            const asset = state.assets.find(a => a.id === assetId);
            return asset ? asset.balance : 0;
        },
        totalBalance: state => {
            return state.assets.reduce((total, asset) => {
                // Pinjaman dihitung sebagai nilai negatif
                if (asset.type === 'loan') {
                    return total - asset.balance;
                }
                return total + asset.balance;
            }, 0);
        }
    },
    mutations: {
        ADD_TRANSACTION(state, transaction) {
            // Menambahkan assetId jika belum ada (untuk backward compatibility)
            if (!transaction.assetId && transaction.type !== 'transfer') {
                transaction.assetId = 'cash';
            }
            
            // Perbarui saldo aset berdasarkan jenis transaksi
            if (transaction.type === 'income') {
                // Untuk pemasukan, tambahkan ke aset yang dipilih
                const asset = state.assets.find(a => a.id === transaction.assetId);
                if (asset) {
                    asset.balance += transaction.amount;
                }
            } else if (transaction.type === 'expense') {
                // Untuk pengeluaran, kurangi dari aset yang dipilih
                const asset = state.assets.find(a => a.id === transaction.assetId);
                if (asset) {
                    asset.balance -= transaction.amount;
                }
            } else if (transaction.type === 'transfer') {
                // Untuk transfer, kurangi dari sumber dan tambahkan ke tujuan
                const sourceAsset = state.assets.find(a => a.id === transaction.sourceAssetId);
                const targetAsset = state.assets.find(a => a.id === transaction.targetAssetId);
                
                if (sourceAsset) {
                    sourceAsset.balance -= (transaction.amount + (transaction.adminFee || 0));
                }
                
                if (targetAsset) {
                    targetAsset.balance += transaction.amount;
                }
            }

            state.transactions.unshift({
                // id: Date.now(),
                id: transaction.id || Date.now() + '_' + Math.random().toString(36).slice(2, 11),
                ...transaction
            });
            this.commit('SAVE_TRANSACTIONS');
            this.commit('SAVE_ASSETS');
        },
        UPDATE_TRANSACTION(state, { id, data }) {
            // Dapatkan transaksi lama
            const oldTransaction = state.transactions.find(transaction => transaction.id === id);
            
            if (oldTransaction) {
                // Batalkan efek transaksi lama pada saldo aset
                if (oldTransaction.type === 'income') {
                    const asset = state.assets.find(a => a.id === oldTransaction.assetId);
                    if (asset) {
                        asset.balance -= oldTransaction.amount;
                    }
                } else if (oldTransaction.type === 'expense') {
                    const asset = state.assets.find(a => a.id === oldTransaction.assetId);
                    if (asset) {
                        asset.balance += oldTransaction.amount;
                    }
                } else if (oldTransaction.type === 'transfer') {
                    const sourceAsset = state.assets.find(a => a.id === oldTransaction.sourceAssetId);
                    const targetAsset = state.assets.find(a => a.id === oldTransaction.targetAssetId);
                    
                    if (sourceAsset) {
                        sourceAsset.balance += (oldTransaction.amount + (oldTransaction.adminFee || 0));
                    }
                    
                    if (targetAsset) {
                        targetAsset.balance -= oldTransaction.amount;
                    }
                }
            }
            
            // Terapkan transaksi baru
            if (data.type === 'income') {
                const asset = state.assets.find(a => a.id === data.assetId);
                if (asset) {
                    asset.balance += data.amount;
                }
            } else if (data.type === 'expense') {
                const asset = state.assets.find(a => a.id === data.assetId);
                if (asset) {
                    asset.balance -= data.amount;
                }
            } else if (data.type === 'transfer') {
                const sourceAsset = state.assets.find(a => a.id === data.sourceAssetId);
                const targetAsset = state.assets.find(a => a.id === data.targetAssetId);
                
                if (sourceAsset) {
                    sourceAsset.balance -= (data.amount + (data.adminFee || 0));
                }
                
                if (targetAsset) {
                    targetAsset.balance += data.amount;
                }
            }

            state.transactions = state.transactions.map(transaction =>
                transaction.id === id ? { ...transaction, ...data } : transaction
            );
            this.commit('SAVE_TRANSACTIONS');
            this.commit('SAVE_ASSETS');
        },
        DELETE_TRANSACTION(state, id) {
            // Hapus transaksi
            state.transactions = state.transactions.filter(transaction => transaction.id !== id);
            this.commit('SAVE_TRANSACTIONS');
            
            // Rekalkulasi saldo aset
            this.commit('RECALCULATE_ASSET_BALANCES');
        },
        RECALCULATE_ASSET_BALANCES(state) {
            // Reset semua saldo asset ke 0
            state.assets.forEach(asset => {
                asset.balance = 0;
            });
            
            // Hitung ulang saldo berdasarkan transaksi yang ada
            state.transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    const asset = state.assets.find(a => a.id === transaction.assetId);
                    if (asset) {
                        asset.balance += transaction.amount;
                    }
                } else if (transaction.type === 'expense') {
                    const asset = state.assets.find(a => a.id === transaction.assetId);
                    if (asset) {
                        asset.balance -= transaction.amount;
                    }
                } else if (transaction.type === 'transfer') {
                    const sourceAsset = state.assets.find(a => a.id === transaction.sourceAssetId);
                    const targetAsset = state.assets.find(a => a.id === transaction.targetAssetId);
                    
                    if (sourceAsset) {
                        sourceAsset.balance -= (transaction.amount + (transaction.adminFee || 0));
                    }
                    
                    if (targetAsset) {
                        targetAsset.balance += transaction.amount;
                    }
                }
            });
            
            this.commit('SAVE_ASSETS');
        },
        SAVE_TRANSACTIONS(state) {
            localStorage.setItem('transactions', JSON.stringify(state.transactions));
        },
        SAVE_ASSETS(state) {
            localStorage.setItem('assets', JSON.stringify(state.assets));
        },
        ADD_ASSET(state, asset) {
            state.assets.push({
                id: Date.now().toString(),
                balance: 0,
                ...asset
            });
            this.commit('SAVE_ASSETS');
        },
        UPDATE_ASSET(state, { id, data }) {
            state.assets = state.assets.map(asset =>
                asset.id === id ? { ...asset, ...data } : asset
            );
            this.commit('SAVE_ASSETS');
        },
        DELETE_ASSET(state, id) {
            // Periksa apakah ada transaksi yang menggunakan aset ini
            const hasTransactions = state.transactions.some(
                t => t.assetId === id || t.sourceAssetId === id || t.targetAssetId === id
            );
            
            if (hasTransactions) {
                throw new Error('Tidak dapat menghapus aset yang digunakan dalam transaksi');
            }
            
            state.assets = state.assets.filter(asset => asset.id !== id);
            this.commit('SAVE_ASSETS');
        },
        SET_SHOW_MODAL(state, show) {
            state.showModal = show;
        },
        SET_EDITING_TRANSACTION(state, id) {
            state.editingTransactionId = id;
        }
    },
    actions: {
        addTransaction({ commit }, transaction) {
            commit('ADD_TRANSACTION', transaction);
        },
        updateTransaction({ commit }, { id, data }) {
            commit('UPDATE_TRANSACTION', { id, data });
        },
        deleteTransaction({ commit }, id) {
            commit('DELETE_TRANSACTION', id);
        },
        addAsset({ commit }, asset) {
            commit('ADD_ASSET', asset);
        },
        updateAsset({ commit }, { id, data }) {
            commit('UPDATE_ASSET', { id, data });
        },
        deleteAsset({ commit }, id) {
            commit('DELETE_ASSET', id);
        },
        showModal({ commit }, editId = null) {
            commit('SET_EDITING_TRANSACTION', editId);
            commit('SET_SHOW_MODAL', true);
        },
        hideModal({ commit }) {
            commit('SET_SHOW_MODAL', false);
        },
        initializeStore({ commit }) {
            commit('RECALCULATE_ASSET_BALANCES');
        }
    }
})