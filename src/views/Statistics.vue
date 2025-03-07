<template>
    <div>
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden mb-6">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800">Statistik Keuangan</h2>
                <div class="flex space-x-2">
                    <select v-model="timeRange" @change="updateChartData"
                        class="bg-gray-100 border-0 text-gray-700 py-1 px-3 rounded-lg text-sm">
                        <option value="thisMonth">Bulan Ini</option>
                        <option value="threeMonths">3 Bulan Terakhir</option>
                        <option value="sixMonths">6 Bulan Terakhir</option>
                        <option value="thisYear">Tahun Ini</option>
                        <option value="all">Semua Waktu</option>
                    </select>
                </div>
            </div>

            <div v-if="hasTransactions" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Grafik Pie Pengeluaran -->
                <div class="card rounded-lg border border-gray-100 p-4 h-full">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Distribusi Pengeluaran</h3>
                    <div class="aspect-square relative h-full">
                        <div class="h-full flex items-center justify-center">
                            <svg class="w-full h-full" viewBox="65 0 400 400">
                                <g transform="translate(200, 200)">
                                    <!-- Pie Chart Elements -->
                                    <g v-for="(slice, index) in expensePieData" :key="index">
                                        <path :d="getArcPath(slice, selectedSlice === slice)" 
                                            :fill="colorPalette[index % colorPalette.length]"
                                            class="hover:opacity-90 cursor-pointer transition-all duration-300"
                                            @mouseenter="activeSlice = slice" 
                                            @mouseleave="activeSlice = null" 
                                            @click="toggleSelectedSlice(slice)">
                                        </path>
                                    </g>
                                    <!-- Pie center -->
                                    <circle r="60" fill="white"></circle>
                                    <text text-anchor="middle" class="text-2xl font-bold" fill="#374151">
                                        {{ formatPercentage(activeSlice?.percentage || 100) }}%
                                    </text>
                                    <text text-anchor="middle" y="20" class="text-xs" fill="#6B7280">
                                        {{ activeSlice?.category || 'Semua Kategori' }}
                                    </text>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <!-- Legends -->
                    <div class="mt-6 flex flex-wrap gap-3">
                        <div v-for="(slice, index) in expensePieData" :key="index" class="flex items-center space-x-2 min-w-[45%]">
                            <div :style="`background-color: ${colorPalette[index % colorPalette.length]}`"
                                class="min-w-[12px] w-3 h-3 rounded-full"></div>
                            <span class="text-sm text-gray-700 capitalize">{{ slice.category }} ({{
                                formatPercentage(slice.percentage) }}%)</span>
                        </div>
                    </div>
                </div>

                <!-- Rangkuman Statistik -->
                <div class="space-y-4">
                    <!-- Total Pengeluaran -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-red-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Total Pengeluaran</h4>
                                <p class="text-xl font-bold text-red-600">
                                    Rp {{ formatNumber(totalExpense) }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <i class="fas fa-arrow-up text-red-600"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Kategori Terbesar -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-blue-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Kategori Terbesar</h4>
                                <p class="text-xl font-bold text-blue-600 capitalize">
                                    {{ topCategory ? topCategory.category : '-' }}
                                </p>
                                <p class="text-sm text-gray-500">
                                    {{ topCategory ? `Rp ${formatNumber(topCategory.amount)}` : '' }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-chart-pie text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Jumlah Transaksi -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-green-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Jumlah Transaksi</h4>
                                <p class="text-xl font-bold text-green-600">
                                    {{ filteredTransactions.length }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <i class="fas fa-exchange-alt text-green-600"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center p-12 text-gray-500">
                <i class="fas fa-chart-pie text-5xl mb-4 text-gray-300"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Fitur Statistik Segera Hadir</h3>
                <p>Belum ada transaksi untuk ditampilkan.</p>
                <button @click="$store.dispatch('showModal')"
                    class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i> Tambah Transaksi
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatisticsView',
    data() {
        return {
            timeRange: 'thisMonth',
            expensePieData: [],
            activeSlice: null,
            selectedSlice: null,
            colorPalette: [
                '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
                '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1'
            ]
        }
    },
    computed: {
        transactions() {
            return this.$store.state.transactions;
        },
        filteredTransactions() {
            const today = new Date();
            const startDate = new Date();

            switch (this.timeRange) {
                case 'thisMonth':
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'threeMonths':
                    startDate.setMonth(today.getMonth() - 3);
                    break;
                case 'sixMonths':
                    startDate.setMonth(today.getMonth() - 6);
                    break;
                case 'thisYear':
                    startDate.setMonth(0);
                    startDate.setDate(1);
                    break;
                case 'all':
                    return this.transactions;
            }

            return this.transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= today;
            });
        },
        expenseTransactions() {
            return this.filteredTransactions.filter(t => t.type === 'expense');
        },
        hasTransactions() {
            return this.expenseTransactions.length > 0;
        },
        totalExpense() {
            return this.expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        },
        topCategory() {
            if (!this.hasTransactions) return null;

            const grouped = this.groupByCategory(this.expenseTransactions);
            let max = { category: '', amount: 0 };

            for (const [category, transactions] of Object.entries(grouped)) {
                const amount = transactions.reduce((sum, t) => sum + t.amount, 0);
                if (amount > max.amount) {
                    max = { category, amount };
                }
            }

            return max;
        }
    },
    methods: {
        formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        formatPercentage(value) {
            return Math.round(value * 10) / 10;
        },
        groupByCategory(transactions) {
            return transactions.reduce((groups, transaction) => {
                const category = transaction.category || 'lainnya';
                if (!groups[category]) {
                    groups[category] = [];
                }
                groups[category].push(transaction);
                return groups;
            }, {});
        },
        updateChartData() {
            if (!this.hasTransactions) return;

            const groupedExpenses = this.groupByCategory(this.expenseTransactions);
            const totalExpense = this.totalExpense;

            this.expensePieData = Object.entries(groupedExpenses).map(([category, transactions]) => {
                const amount = transactions.reduce((sum, t) => sum + t.amount, 0);
                const percentage = (amount / totalExpense) * 100;
                return {
                    category,
                    amount,
                    percentage
                };
            }).sort((a, b) => b.amount - a.amount);
        },
        getArcPath(slice, isSelected) {
            const radius = isSelected ? 135 : 120;
            let startAngle = 0;

            for (let i = 0; i < this.expensePieData.indexOf(slice); i++) {
                startAngle += (this.expensePieData[i].percentage / 100) * Math.PI * 2;
            }

            const endAngle = startAngle + (slice.percentage / 100) * Math.PI * 2;
            return `M ${radius * Math.sin(startAngle)} ${-radius * Math.cos(startAngle)} A ${radius} ${radius} 0 ${slice.percentage > 50 ? 1 : 0} 1 ${radius * Math.sin(endAngle)} ${-radius * Math.cos(endAngle)} L 0 0 Z`;
        },
        toggleSelectedSlice(slice) {
            if (this.selectedSlice === slice) {
                this.selectedSlice = null;
            } else {
                this.selectedSlice = slice;
            }
        }
    },
    mounted() {
        this.updateChartData();
    }
}
</script>