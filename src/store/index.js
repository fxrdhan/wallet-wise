// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        transactions: JSON.parse(localStorage.getItem('transactions')) || [],
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
                .filter(transaction => transaction.type === 'expense' || transaction.type === 'transfer')
                .reduce((total, transaction) => {
                    return total + transaction.amount + (transaction.type === 'transfer' ? (transaction.adminFee || 0) : 0);
                }, 0);
        },
        balance: (state, getters) => {
            return getters.income - getters.expense;
        },
        sortedTransactions: state => {
            return [...state.transactions].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        }
    },
    mutations: {
        ADD_TRANSACTION(state, transaction) {
            state.transactions.unshift({
                id: Date.now(),
                ...transaction
            });
            this.commit('SAVE_TRANSACTIONS');
        },
        UPDATE_TRANSACTION(state, { id, data }) {
            state.transactions = state.transactions.map(transaction =>
                transaction.id === id ? { ...transaction, ...data } : transaction
            );
            this.commit('SAVE_TRANSACTIONS');
        },
        DELETE_TRANSACTION(state, id) {
            state.transactions = state.transactions.filter(transaction => transaction.id !== id);
            this.commit('SAVE_TRANSACTIONS');
        },
        SAVE_TRANSACTIONS(state) {
            localStorage.setItem('transactions', JSON.stringify(state.transactions));
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
        showModal({ commit }, editId = null) {
            commit('SET_EDITING_TRANSACTION', editId);
            commit('SET_SHOW_MODAL', true);
        },
        hideModal({ commit }) {
            commit('SET_SHOW_MODAL', false);
        }
    }
})