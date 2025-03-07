<template>
    <div>
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
                <div class="flex space-x-2">
                    <button
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm transition-colors">
                        <i class="fas fa-filter mr-1"></i> Filter
                    </button>
                    <button
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm transition-colors">
                        <i class="fas fa-download mr-1"></i> Ekspor
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 relative z-10">
                <table class="min-w-full divide-y divide-gray-200">
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.date }}</td>
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

            <i class="fas fa-history text-gray-100 opacity-5 absolute -bottom-10 -right-10 text-9xl"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TransactionHistory',
    computed: {
        transactions() {
            return this.$store.getters.sortedTransactions;
        }
    },
    mounted() {
        // Scroll ke atas halaman saat komponen dimuat
        window.scrollTo(0, 0);
    },
    methods: {
        formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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