<!-- src/views/Home.vue -->
<template>
    <div>
        <!-- Dashboard Cards - Responsive Layout -->
        <section class="mb-6">
            <!-- Card Saldo - Updated with gradient background -->
            <div class="bg-gradient-to-r from-green-500/90 to-green-600/80 rounded-xl shadow-sm p-4 sm:p-5 card-hover transition-all mb-4 relative overflow-hidden">
                <div class="flex justify-between items-center h-full relative z-10">
                    <div class="flex-1">
                        <h2 class="text-base sm:text-lg font-semibold text-white">Saldo Saat Ini</h2>
                        <p class="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-white">Rp {{ formatNumber(totalBalance) }}</p>
                        <p class="text-xs sm:text-sm text-green-100 mt-1" v-if="isClient">Update terakhir: {{ lastUpdate }}</p>
                    </div>
                    <div class="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0 ml-3 relative z-10">
                        <i class="fas fa-wallet text-green-500 text-lg sm:text-xl"></i>
                    </div>
                </div>
                <i class="fas fa-wallet text-green-400/20 absolute -bottom-2 -right-2 text-8xl"></i>
            </div>

            <!-- Income and Expense Cards -->
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <!-- Card Pemasukan - Updated with gradient background -->
                <div class="bg-gradient-to-r from-blue-500/90 to-blue-600/80 rounded-xl shadow-sm p-3 sm:p-5 card-hover transition-all h-full relative overflow-hidden">
                    <div class="flex flex-col h-full relative z-10">
                        <div class="flex justify-between items-start mb-auto">
                            <h2 class="text-sm sm:text-base font-semibold text-white">Pemasukan</h2>
                            <div class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 ml-1">
                                <i class="fas fa-arrow-down text-white text-xs sm:text-sm"></i>
                            </div>
                        </div>
                        <div class="mt-1 sm:mt-2">
                            <p class="text-xl sm:text-2xl font-bold text-white">Rp {{ formatNumber(income) }}</p>
                            <div class="flex items-center mt-1 text-xs sm:text-sm text-blue-100">
                                <i class="fas fa-chart-line mr-1 text-xs"></i>
                                <span>{{ changePercentage }}% dari bulan lalu</span>
                            </div>
                        </div>
                    </div>
                    <i class="fas fa-arrow-down text-blue-400/20 absolute -bottom-2 -right-2 text-8xl"></i>
                </div>

                <!-- Card Pengeluaran - Updated with gradient background -->
                <div class="bg-gradient-to-r from-red-500/90 to-red-600/80 rounded-xl shadow-sm p-3 sm:p-5 card-hover transition-all h-full relative overflow-hidden">
                    <div class="flex flex-col h-full relative z-10">
                        <div class="flex justify-between items-start mb-auto">
                            <h2 class="text-sm sm:text-base font-semibold text-white">Pengeluaran</h2>
                            <div class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 ml-1">
                                <i class="fas fa-arrow-up text-white text-xs sm:text-sm"></i>
                            </div>
                        </div>
                        <div class="mt-1 sm:mt-2">
                            <p class="text-xl sm:text-2xl font-bold text-white">Rp {{ formatNumber(expense) }}</p>
                            <div class="flex items-center mt-1 text-xs sm:text-sm text-red-100">
                                <i class="fas fa-chart-line mr-1 text-xs"></i>
                                <span>{{ changePercentage }}% dari bulan lalu</span>
                            </div>
                        </div>
                    </div>
                    <i class="fas fa-arrow-up text-red-400/20 absolute -bottom-2 -right-2 text-8xl"></i>
                </div>
            </div>
        </section>

        <!-- Asset Overview -->
        <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 card-hover transition-all mb-6">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Ringkasan Aset</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <!-- Sort assets to ensure correct display order -->
                <template v-for="asset in sortedAssets" :key="asset.id">
                <div class="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm"
                    :class="{ 'bg-red-50': asset.type === 'loan', 'bg-blue-50': asset.type === 'bank', 'bg-purple-50': asset.type === 'savings', 'bg-green-50': asset.type === 'cash', 'bg-orange-50': asset.type === 'credit' }">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-medium text-sm sm:text-base">{{ asset.name }}</h3>
                            <p class="text-lg sm:text-xl font-bold" :class="{ 'text-red-600': asset.type === 'loan', 'text-blue-600': asset.type === 'bank', 'text-purple-600': asset.type === 'savings', 'text-green-600': asset.type === 'cash', 'text-orange-600': asset.type === 'credit' }">
                                Rp {{ formatNumber(asset.balance) }}
                            </p>
                        </div>
                        <div :class="{ 'bg-red-100': asset.type === 'loan', 'bg-blue-100': asset.type === 'bank', 'bg-purple-100': asset.type === 'savings', 'bg-green-100': asset.type === 'cash', 'bg-orange-100': asset.type === 'credit' }" 
                            class="w-12 h-12 rounded-full flex items-center justify-center">
                            <i :class="[
                               getAssetIcon(asset.type),
                               'text-xl',
                               { 'text-red-600': asset.type === 'loan', 'text-blue-600': asset.type === 'bank', 'text-purple-600': asset.type === 'savings', 'text-green-600': asset.type === 'cash', 'text-orange-600': asset.type === 'credit' }
                            ]"></i>
                        </div>
                    </div>
                </div>
                </template>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div v-if="recentTransactions.length > 0" 
            class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800">Transaksi Terbaru</h2>
                <router-link to="/history" class="text-green-600 text-sm hover:underline">
                    <i class="fas fa-arrow-right mr-1"></i>Lihat Semua
                </router-link>
            </div>

            <div class="space-y-4">
                <div v-for="transaction in recentTransactions" :key="transaction.id"
                    class="p-4 border border-gray-100 rounded-lg flex justify-between items-center">
                    <div class="flex items-center">
                        <div :class="getTypeIconClass(transaction.type)"
                            class="w-10 h-10 rounded-full flex items-center justify-center mr-4">
                            <i :class="getTypeIcon(transaction.type)" class="text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-medium">{{ transaction.description }}</h3>
                            <p class="text-sm text-gray-500 mb-1">
                                {{ formatDateSimple(transaction.date) }}  
                            </p>
                            <p class="text-xs text-gray-500 flex items-center">
                                <span v-if="transaction.type !== 'transfer'">
                                    <i :class="getAssetIcon(getAssetType(transaction.assetId)) + ' text-xs mr-1'"></i>{{ getAssetName(transaction.assetId) }}
                                </span>
                                <span v-else>
                                    <i :class="getAssetIcon(getAssetType(transaction.sourceAssetId)) + ' text-xs mr-1'"></i>{{ getAssetName(transaction.sourceAssetId) }} → <i :class="getAssetIcon(getAssetType(transaction.targetAssetId)) + ' text-xs mr-1'"></i>{{ getAssetName(transaction.targetAssetId) }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div :class="getAmountClass(transaction.type)" class="text-lg font-bold whitespace-nowrap">
                        {{ getAmountPrefix(transaction.type) }} {{ formatNumber(getTransactionTotal(transaction)) }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-md p-6 card-hover transition-all text-center">
            <i class="fas fa-receipt text-gray-300 text-5xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h3>
            <p class="text-gray-500 mb-4">Tambahkan transaksi pertama Anda dengan menekan tombol + di bawah</p>
            <button @click="addTransaction"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                <i class="fas fa-plus mr-2"></i> Tambah Transaksi
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeView',
    data() {
        return {
            isClient: false
        }
    },
    computed: {
        assets() {
            return this.$store.state.assets;
        },
        sortedAssets() {
            // Define order of asset types
            const typeOrder = {
                'cash': 1,
                'bank': 2,
                'savings': 3,
                'credit': 4,
                'loan': 5
            };
            
            // Return sorted array of assets
            return [...this.assets].sort((a, b) => {
                const orderA = typeOrder[a.type] || 99;
                const orderB = typeOrder[b.type] || 99;
                
                return orderA - orderB;
            });
        },
        income() {
            return this.$store.getters.income;
        },
        expense() {
            return this.$store.getters.expense;
        },
        balance() {
            return this.$store.getters.balance;
        },
        totalBalance() {
            return this.$store.getters.totalBalance;
        },
        lastUpdate() {
            return 'Hari Ini';
        },
        changePercentage() {
            return '+0';
        },
        recentTransactions() {
            return this.$store.getters.sortedTransactions.slice(0, 5);
        }
    },
    mounted() {
        this.isClient = true;
    },
    methods: {
        formatNumber(number) {
            // Gunakan pendekatan yang lebih konsisten untuk format angka
            return number.toLocaleString('id-ID').replace(/,/g, ".");
        },
        formatDate(date) {
            // Fungsi ini masih ada untuk kompatibilitas
            const d = new Date(date);
            try {
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                return this.formatDateSimple(date);
            }
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
        getTypeIcon(type) {
            const icons = {
                income: 'fas fa-arrow-down',
                expense: 'fas fa-arrow-up',
                transfer: 'fas fa-exchange-alt'
            };
            return icons[type] || 'fas fa-question';
        },
        getTypeIconClass(type) {
            const classes = {
                income: 'bg-green-500',
                expense: 'bg-red-500',
                transfer: 'bg-blue-500'
            };
            return classes[type] || 'bg-gray-500';
        },
        getAmountClass(type) {
            const classes = {
                income: 'text-green-600',
                expense: 'text-red-600',
                transfer: 'text-blue-600'
            };
            return classes[type] || 'text-gray-600';
        },
        getAmountPrefix(type) {
            return type === 'income' ? '+' : '-';
        },
        getTransactionTotal(transaction) {
            return transaction.amount + (transaction.type === 'transfer' ? (transaction.adminFee || 0) : 0);
        },
        addTransaction() {
            this.$store.dispatch('showModal');
        },
        getAssetIcon(type) {
            const icons = {
                'cash': 'fas fa-money-bill-wave',
                'bank': 'fas fa-university',
                'credit': 'fas fa-credit-card',
                'loan': 'fas fa-hand-holding-usd',
                'savings': 'fas fa-piggy-bank'
            };
            return icons[type] || 'fas fa-wallet';
        },
        getAssetName(assetId) {
            const asset = this.$store.state.assets.find(a => a.id === assetId);
            return asset ? asset.name : 'Tidak Diketahui';
        },
        getAssetType(assetId) {
            const asset = this.$store.state.assets.find(a => a.id === assetId);
            return asset ? asset.type : 'cash';
        }
    }
}
</script>