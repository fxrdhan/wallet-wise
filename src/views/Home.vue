<!-- src/views/Home.vue -->
<template>
    <div>
        <!-- Dashboard Cards -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Card Saldo -->
            <div class="card-balance rounded-xl shadow-md p-5 card-hover transition-all">
                <div class="flex flex-col card-content relative z-10">
                    <h2 class="text-lg font-semibold text-white opacity-90">Saldo Saat Ini</h2>
                    <p class="text-3xl font-bold mt-4">Rp {{ formatNumber(balance) }}</p>
                    <p class="text-sm text-white opacity-70 mt-2" v-if="isClient">Update terakhir: {{ lastUpdate }}</p>
                </div>
                <i class="fas fa-wallet card-icon"></i>
            </div>

            <!-- Card Pemasukan -->
            <div class="card-income rounded-xl shadow-md p-5 card-hover transition-all">
                <div class="flex flex-col card-content relative z-10">
                    <h2 class="text-lg font-semibold text-white opacity-90">Total Pemasukan</h2>
                    <p class="text-3xl font-bold mt-4">Rp {{ formatNumber(income) }}</p>
                    <div class="flex items-center mt-2 text-sm text-white opacity-70">
                        <i class="fas fa-chart-line mr-1"></i>
                        <span>{{ changePercentage }}% dari bulan lalu</span>
                    </div>
                </div>
                <i class="fas fa-arrow-down card-icon"></i>
            </div>

            <!-- Card Pengeluaran -->
            <div class="card-expense rounded-xl shadow-md p-5 card-hover transition-all">
                <div class="flex flex-col card-content relative z-10">
                    <h2 class="text-lg font-semibold text-white opacity-90">Total Pengeluaran</h2>
                    <p class="text-3xl font-bold mt-4">Rp {{ formatNumber(expense) }}</p>
                    <div class="flex items-center mt-2 text-sm text-white opacity-70">
                        <i class="fas fa-chart-line mr-1"></i>
                        <span>{{ changePercentage }}% dari bulan lalu</span>
                    </div>
                </div>
                <i class="fas fa-arrow-up card-icon"></i>
            </div>
        </section>

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
                            <p class="text-sm text-gray-500">{{ formatDateSimple(transaction.date) }}</p>
                        </div>
                    </div>
                    <div :class="getAmountClass(transaction.type)" class="text-lg font-bold">
                        {{ getAmountPrefix(transaction.type) }} Rp {{ formatNumber(getTransactionTotal(transaction)) }}
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
        income() {
            return this.$store.getters.income;
        },
        expense() {
            return this.$store.getters.expense;
        },
        balance() {
            return this.$store.getters.balance;
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
        }
    }
}
</script>