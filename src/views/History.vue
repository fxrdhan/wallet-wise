<!-- src/views/History.vue -->
<template>
    <div class="transaction-history">
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800 flex-shrink-0">{{ filterTitle }}</h2>
                <div class="flex space-x-3 mt-2 sm:mt-0 justify-end">
                    <DropdownMenu class="icon-only-dropdown">
                        <template #button-content>
                            <i class="fas fa-filter"></i>
                        </template>
                        <MenuItem v-slot="{ active }" v-for="option in filterOptions" :key="option.value">
                            <button @click="filterByType(option.value)" 
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                                <i :class="option.icon" class="mr-2"></i> {{ option.label }}
                            </button>
                        </MenuItem>
                    </DropdownMenu>
                    <DropdownMenu class="icon-only-dropdown">
                        <template #button-content>
                            <i class="fas fa-download"></i>
                        </template>
                        <!-- Add export menu items here -->
                    </DropdownMenu>
                </div>
            </div>

            <!-- Desktop view: Table (changed z-index from 10 to 5) -->
            <div class="overflow-x-auto rounded-lg border border-gray-200 relative z-5 hidden md:block">
                <table class="w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deskripsi</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jumlah</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="transactions.length === 0">
                            <td class="px-6 py-4 text-sm text-gray-500" colspan="5">Belum ada transaksi.</td>
                        </tr>
                        <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateSimple(transaction.date) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                                transaction.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                                getTransactionDetails(transaction) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm"
                                :class="getAmountColorClass(transaction.type)">
                                {{ getAmountPrefix(transaction.type) }} Rp {{
                                    formatNumber(getTransactionTotal(transaction)) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button class="text-blue-600 hover:text-blue-900 mr-3"
                                    @click="editTransaction(transaction.id)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-600 hover:text-red-900"
                                    @click="deleteTransaction(transaction.id)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Mobile view: Card list -->
            <div class="md:hidden space-y-4 relative z-5">
                <div v-if="transactions.length === 0" class="text-center py-4 text-sm text-gray-500">
                    Belum ada transaksi.
                </div>
                <div v-for="transaction in transactions" :key="transaction.id" 
                    class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div class="flex justify-between items-start">
                        <div class="flex-1 mr-4">
                            <h3 class="font-medium text-gray-900">{{ transaction.description }}</h3>
                            <p class="text-sm text-gray-500">{{ formatDateSimple(transaction.date) }}</p>
                            <p class="text-sm text-gray-500 capitalize">{{ getTransactionDetails(transaction) }}</p>
                        </div>
                        <div :class="getAmountColorClass(transaction.type)" class="font-bold text-right">
                            {{ getAmountPrefix(transaction.type) }} Rp {{ formatNumber(getTransactionTotal(transaction)) }}
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-3">
                        <button class="text-blue-600 hover:text-blue-900 p-2" @click="editTransaction(transaction.id)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="text-red-600 hover:text-red-900 p-2" @click="deleteTransaction(transaction.id)">
                            <i class="fas fa-trash-alt"></i> Hapus
                        </button>
                    </div>
                </div>
            </div>

            <i class="fas fa-history text-gray-100 opacity-5 absolute -bottom-10 -right-10 text-9xl"></i>
        </div>
    </div>
</template>

<script>
import { MenuItem } from '@headlessui/vue'
import DropdownMenu from '../components/DropdownMenu.vue'

export default {
    name: 'TransactionHistory',
    components: { MenuItem, DropdownMenu },
    data() {
        return {
            filterType: 'all',
            filterOptions: [
                { value: 'all', label: 'Riwayat', icon: 'fas fa-list text-gray-500' },
                { value: 'income', label: 'Pemasukan', icon: 'fas fa-arrow-down text-green-500' },
                { value: 'expense', label: 'Pengeluaran', icon: 'fas fa-arrow-up text-red-500' },
                { value: 'transfer', label: 'Transfer', icon: 'fas fa-exchange-alt text-blue-500' }
            ]
        }
    },
    computed: {
        filterTitle() {
            if (this.filterType === 'all') {
                return 'Riwayat';
            } else {
                const option = this.filterOptions.find(opt => opt.value === this.filterType);
                return option ? option.label : 'Riwayat Transaksi';
            }
        },
        transactions() {
            if (this.filterType !== 'all') {
                return this.$store.getters.sortedTransactions.filter(t => t.type === this.filterType);
            }
            return this.$store.getters.sortedTransactions;
        }
    },
    methods: {
        formatNumber(number) {
            return number.toLocaleString('id-ID').replace(/,/g, ".");
        },
        formatDateSimple(date) {
            // Fungsi format tanggal yang lebih konsisten antara server dan client
            const d = new Date(date);
            const day = d.getDate();
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const month = months[d.getMonth()];
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
        },
        getTransactionDetails(transaction) {
            if (transaction.type === 'transfer') {
                let details = `Transfer ke ${transaction.recipient || 'Penerima'} via ${this.capitalizeFirstLetter(transaction.platform || 'bank')}`;
                return details;
            }
            return this.capitalizeFirstLetter(transaction.category || '');
        },
        getTransactionTotal(transaction) {
            return transaction.amount + (transaction.type === 'transfer' ? (transaction.adminFee || 0) : 0);
        },
        getAmountColorClass(type) {
            const colors = {
                income: 'text-green-600',
                expense: 'text-red-600',
                transfer: 'text-purple-600'
            };
            return colors[type] || 'text-gray-600';
        },
        getAmountPrefix(type) {
            return type === 'income' ? '+' : '-';
        },
        filterByType(type) {
            this.filterType = type;
        },
        capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        editTransaction(id) {
            this.$store.dispatch('showModal', id);
        },
        deleteTransaction(id) {
            if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                this.$store.dispatch('deleteTransaction', id);
            }
        }
    }
}
</script>

<style scoped>
/* Responsive adjustments */
:deep(.absolute) {
    z-index: 1000 !important; /* Increase z-index to ensure dropdown is above all other elements */
}

/* Icon at the bottom of the card */
i.fas.fa-history.text-gray-100 { z-index: 1; }

/* Container for dropdown menus */
.flex.space-x-2 {
    position: relative;
}

@media (max-width: 768px) {
    .transaction-history .flex.items-center.justify-between {
        align-items: center;
    }
    
    .transaction-history .flex.items-center.justify-between .flex.space-x-2 {
        margin-top: 0.75rem;
        width: 100%;
        justify-content: flex-start;
    }
}

/* Force dropdown to appear above everything else in this component */
.transaction-history :deep(.menuItems) {
    position: absolute !important;
    top: auto !important;
    right: 0 !important;
    z-index: 1000 !important;
}

/* Icon-only dropdown styling - removed box/container */
.icon-only-dropdown :deep(.fas.fa-chevron-down) {
    display: none;
}

.icon-only-dropdown :deep(.menuItems button i) {
    display: inline-block;
}

.icon-only-dropdown :deep(button) {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Removed bg-gray-100 and rounded-full classes */
}
.icon-only-dropdown :deep(button:hover) {
    color: #374151; /* gray-700 */
}

/* Force dropdown to appear above everything else in this component */
.icon-only-dropdown :deep(.menuItems) {
    position: absolute !important;
    right: 0 !important;
    top: 100% !important;
    /* left: auto !important; */
    z-index: 1000 !important;
    width: 180px !important;
}

/* Ensure menu items are properly displayed with larger clickable area */
.icon-only-dropdown :deep(.menuItems button) {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
}
</style>