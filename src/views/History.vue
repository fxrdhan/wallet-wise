<!-- src/views/History.vue -->
<template>
    <div class="transaction-history">
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800 flex-shrink-0">{{ filterTitle }}</h2>
                <div class="flex space-x-3 mt-2 sm:mt-0 justify-end relative z-20">
                    <DropdownMenu class="icon-only-dropdown">
                        <template #button-content>
                            <i class="fas fa-filter relative z-20"></i>
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
                            <i class="fas fa-download relative z-20"></i>
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
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-buttons">
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
                <div v-for="transaction in transactions" :key="transaction.id" class="transaction-card-wrapper mb-6">
                  <div class="bg-white rounded-t-lg border border-gray-200 shadow-sm p-4 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div class="flex-1 mr-4">
                            <h3 class="font-medium text-gray-900">{{ transaction.description }}</h3>
                            <p class="text-sm text-gray-500 capitalize">{{ getTransactionDetails(transaction) }}</p>
                        </div>
                        <div :class="getAmountColorClass(transaction.type)" class="font-bold text-right">
                            {{ getAmountPrefix(transaction.type) }} Rp {{ formatNumber(getTransactionTotal(transaction)) }}
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <p class="text-xs text-gray-400 mt-2">{{ formatDateSimple(transaction.date) }}</p>
                    </div>
                  </div>
                  <div class="action-sticks-container">
                    <!-- Tombol Edit (Stick Oranye di Kiri) -->
                    <div @click="editTransaction(transaction.id)" class="action-stick edit-stick"></div>
                    <!-- Tombol Hapus (Stick Merah di Kanan) -->
                    <div @click="deleteTransaction(transaction.id)" class="action-stick delete-stick"></div>
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
                { value: 'all', label: 'Semua', icon: 'fas fa-list text-gray-500' },
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
                return 'Transfer';
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
.transaction-history {
    padding-bottom: 40px; 
}
:deep(.absolute) {
    z-index: 1000 !important; 
}

/* Icon at the bottom of the card */
i.fas.fa-history.text-gray-100 { z-index: 1; }

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

.transaction-history :deep(.menuItems) {
    position: absolute !important;
    top: 100% !important;
    transform: translateY(1px);
    right: 0 !important;
    z-index: 1000 !important;
}

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
}
.icon-only-dropdown :deep(button:hover) {
    color: #374151; /* gray-700 */
}

.icon-only-dropdown :deep(.menuItems) {
    position: absolute !important;
    right: 0 !important;
    top: 100% !important;
    z-index: 1000 !important;
    width: 180px !important;
}

.icon-only-dropdown :deep(.menuItems button) {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
}

.transaction-card-wrapper {
    position: relative;
    margin-bottom: 20px;
}

.transaction-card-wrapper:last-child {
    margin-bottom: 40px;
}

.action-sticks-container {
    display: flex;
    justify-content: space-between;
    margin-top: -5px;
    position: relative;
    z-index: 20;
    padding: 5px 0px;
    pointer-events: auto;
}

.action-stick {
    height: 5px;
    width: 40px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0 0 20px 20px;
    pointer-events: auto !important;
    opacity: 0.8;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.action-stick:hover {
    transform: scaleX(1.1);
    opacity: 1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.edit-stick {
    background-color: #F97316; /* orange-500 */
}

.edit-stick:hover {
    background-color: #EA580C; /* orange-600 */
}

.delete-stick {
    background-color: #EF4444; /* red-500 */
}

.delete-stick:hover {
    background-color: #DC2626; /* red-600 */
}

.action-buttons button {
    cursor: pointer !important;
    position: relative;
    z-index: 15;
}

i.fas.fa-history.text-gray-100 {
    z-index: 1 !important;
    pointer-events: none !important;
}

</style>