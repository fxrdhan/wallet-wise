<!-- src/views/Statistics.vue -->
<template>
    <div>
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden mb-6">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800">Statistik Keuangan</h2>
                <div class="flex space-x-2">
                    <DropdownMenu>
                        <template #button-content>
                            <span>{{ getTimeRangeLabel }}</span>
                        </template>
                        <MenuItem v-slot="{ active }">
                            <button @click="setTimeRange('thisMonth')" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                                Bulan Ini
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button @click="setTimeRange('threeMonths')" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                                3 Bulan Terakhir
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button @click="setTimeRange('sixMonths')" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                                6 Bulan Terakhir
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button @click="setTimeRange('thisYear')" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                                Tahun Ini
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button @click="setTimeRange('all')" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                                Semua Waktu
                            </button>
                        </MenuItem>
                    </DropdownMenu>
                </div>
            </div>

            <!-- Main Stats Grid -->
            <div v-if="hasTransactions" class="space-y-4">
                <!-- Row 1: Three main statistic cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Total Pemasukan -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-green-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Total Pemasukan</h4>
                                <p class="text-xl font-bold text-green-600">
                                    Rp {{ formatNumber(totalIncome) }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <i class="fas fa-arrow-down text-green-600"></i>
                            </div>
                        </div>
                    </div>
                    
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

                    <!-- Pengeluaran Terbesar -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-blue-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Pengeluaran Terbesar</h4>
                                <p class="text-xl font-bold text-blue-600">
                                    Rp {{ formatNumber(topCategory ? topCategory.amount : 0) }}
                                </p>
                                <p class="text-sm text-gray-500 capitalize" v-if="topCategory && topCategory.category">
                                    {{ topCategory.category }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-chart-pie text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Jumlah Transaksi -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-purple-50">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-sm text-gray-600">Jumlah Transaksi</h4>
                                <p class="text-xl font-bold text-purple-600">
                                    {{ filteredTransactions.length }}
                                </p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <i class="fas fa-exchange-alt text-purple-600"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Distribution by Asset -->
                    <div class="card rounded-lg border border-gray-100 p-4 bg-white mt-4">
                        <h4 class="text-lg font-semibold text-gray-700 mb-4">Distribusi berdasarkan Aset</h4>
                        <div class="space-y-3">
                            <template v-for="asset in sortedAssets" :key="asset.id">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center">
                                        <div :class="{ 'bg-red-100': asset.type === 'loan', 'bg-blue-100': asset.type === 'bank', 'bg-purple-100': asset.type === 'savings', 'bg-green-100': asset.type === 'cash', 'bg-orange-100': asset.type === 'credit' }" 
                                            class="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                            <i :class="[
                                                getAssetIcon(asset.type),
                                                'text-sm',
                                                { 'text-red-600': asset.type === 'loan', 'text-blue-600': asset.type === 'bank', 'text-purple-600': asset.type === 'savings', 'text-green-600': asset.type === 'cash', 'text-orange-600': asset.type === 'credit' }
                                            ]"></i>
                                        </div>
                                        <span>{{ asset.name }}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="mr-4">
                                            <span :class="{ 'text-red-600': asset.type === 'loan', 'text-blue-600': asset.type === 'bank', 'text-purple-600': asset.type === 'savings', 'text-green-600': asset.type === 'cash', 'text-orange-600': asset.type === 'credit' }" class="font-medium">{{ formatPercentage(getAssetPercentage(asset)) }}%</span>
                                        </div>
                                        <div class="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div :class="{ 'bg-red-500': asset.type === 'loan', 'bg-blue-500': asset.type === 'bank', 'bg-purple-500': asset.type === 'savings', 'bg-green-500': asset.type === 'cash', 'bg-orange-500': asset.type === 'credit' }" class="h-full" :style="`width: ${getAssetPercentage(asset)}%`"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Pie Chart -->
                <div class="mt-6">
                    <div class="card rounded-lg border border-gray-100 p-4">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4 ml-1">Distribusi Pengeluaran</h3>
                        
                        <!-- Placeholder ketika tidak ada data pengeluaran -->
                        <div v-if="expensePieData.length === 0" class="text-center py-8">
                            <i class="fas fa-chart-pie text-gray-300 text-5xl mb-4"></i>
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pengeluaran</h3>
                            <p class="text-gray-500 mb-4">Tambahkan transaksi pengeluaran untuk melihat distribusinya</p>
                            <button @click="addTransaction"
                                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                                <i class="fas fa-plus mr-2"></i> Tambah Pengeluaran
                            </button>
                        </div>
                        <div v-else class="mt-4 overflow-y-hidden pb-2">
                            <!-- New Legend Design -->
                            <div class="flex flex-wrap gap-2 mb-4 ml-1 mt-1">
                                <div v-for="(slice, index) in expensePieData" :key="index"
                                    class="px-2 py-1 rounded-full text-xs flex items-center space-x-1 cursor-pointer transition-all duration-300"
                                    :style="`
                                        background-color: ${getLegendBackgroundColor(slice, index)}; 
                                        border: 1px solid ${colorPalette[index % colorPalette.length]};
                                        opacity: ${getItemOpacity(slice)};
                                        transform: ${activeSlice === slice ? 'scale(1.05)' : 'scale(1)'};
                                    `"
                                    @mouseenter="activeSlice = slice" 
                                    @mouseleave="activeSlice = null"
                                    @click="toggleSelectedSlice(slice)">
                                    <div :style="`background-color: ${colorPalette[index % colorPalette.length]}`"
                                        class="w-2 h-2 rounded-full"></div>
                                    <span class="capitalize">{{ slice.category }} ({{ formatPercentage(slice.percentage)
                                        }}%)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Pie Chart Container -->
                        <div v-if="expensePieData.length > 0" class="aspect-square relative h-64 mx-auto">
                            <div class="h-full flex items-center justify-center">
                                <svg class="w-full h-full" viewBox="0 0 400 400">
                                    <g transform="translate(200, 200)">
                                        <!-- Pie Chart Elements -->
                                        <g v-for="(slice, index) in expensePieData" :key="index">
                                            <path :d="getArcPath(slice, selectedSlice === slice)"
                                                :fill="getSliceFill(slice, index)"
                                                class="transition-all duration-300"
                                                @mouseenter="activeSlice = slice" @mouseleave="activeSlice = null"
                                                @click="toggleSelectedSlice(slice)">
                                            </path>
                                        </g>
                                        <!-- Pie center -->
                                        <circle r="80" fill="white"></circle>
                                        <text text-anchor="middle" class="text-3xl font-bold" fill="#374151">
                                            {{ formatPercentage(activeSlice?.percentage || 100) }}%
                                        </text>
                                        <text text-anchor="middle" y="25" class="text-s" fill="#6B7280">
                                            {{ activeSlice?.category || 'Semua Kategori' }}
                                        </text>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- New Section: Total Amount for Hovered Category -->
                        <div 
                            v-if="activeSlice && expensePieData.length > 0" 
                            class="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4 transition-all duration-300 transform"
                            style="transform-origin: top center;">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="text-sm text-gray-600 pb-1"><span class="font-medium capitalize">{{ activeSlice.category }}</span></h4>
                                    <p class="text-xl font-bold" :style="`color: ${getColorForCategory(activeSlice.category)}`">
                                        Rp {{ formatNumber(activeSlice.amount) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center p-12 text-gray-500">
                <i class="fas fa-chart-pie text-5xl mb-4 text-gray-300"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                <p class="text-gray-500 mb-4">Tambahkan transaksi pertama Anda dengan menekan tombol + di bawah</p>
                <button @click="addTransaction"
                    class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i> Tambah Transaksi
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { MenuItem } from '@headlessui/vue'
import DropdownMenu from '../components/DropdownMenu.vue'

export default {
    name: 'StatisticsView',
    components: { MenuItem, DropdownMenu },
    data() {
        return {
            timeRange: 'thisMonth',
            expensePieData: [],
            activeSlice: null,
            selectedSlice: null,
            colorPalette: [
                '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
                '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1'
            ],
            selectionTimeout: null
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
        incomeTransactions() {
            return this.filteredTransactions.filter(t => t.type === 'income');
        },
        hasTransactions() {
            return this.filteredTransactions.length > 0;
        },
        totalExpense() {
            return this.expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        },
        totalIncome() {
            return this.incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
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
        },
        getTimeRangeLabel() {
            const timeRangeLabels = {
                'thisMonth': 'Bulan Ini',
                'threeMonths': '3 Bulan Terakhir',
                'sixMonths': '6 Bulan Terakhir',
                'thisYear': 'Tahun Ini',
                'all': 'Semua Waktu'
            };
            return timeRangeLabels[this.timeRange] || 'Bulan Ini';
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

            this.expensePieData = Object.entries(groupedExpenses)
                .map(([category, transactions]) => {
                    const amount = transactions.reduce((sum, t) => sum + t.amount, 0);
                    const percentage = (amount / totalExpense) * 100;
                    return { category, amount, percentage };
                })
                .sort((a, b) => b.amount - a.amount)
        },
        getSliceFill(slice, index) {
            const baseColor = this.colorPalette[index % this.colorPalette.length];
            
            // If we have an active or selected slice, reduce saturation of other slices
            if ((this.activeSlice || this.selectedSlice) && 
                slice !== this.activeSlice && 
                slice !== this.selectedSlice) {
                // Create a more transparent/desaturated version of the color
                return `${baseColor}80`; // 80 is 50% opacity in hex
            }
            
            return baseColor;
        },
        getArcPath(slice) {
            // Use standard radius regardless of selection state
            const radius = 170;
            // Only apply enlargement effect when hovering (activeSlice)
            const effectiveRadius = this.activeSlice === slice ? 185 : radius;
            let startAngle = 0;

            for (let i = 0; i < this.expensePieData.indexOf(slice); i++) {
                startAngle += (this.expensePieData[i].percentage / 100) * Math.PI * 2;
            }

            const endAngle = startAngle + (slice.percentage / 100) * Math.PI * 2;
            return `M ${effectiveRadius * Math.sin(startAngle)} ${-effectiveRadius * Math.cos(startAngle)} A ${effectiveRadius} ${effectiveRadius} 0 ${slice.percentage > 50 ? 1 : 0} 1 ${effectiveRadius * Math.sin(endAngle)} ${-effectiveRadius * Math.cos(endAngle)} L 0 0 Z`;
        },
        toggleSelectedSlice(slice) {
            // Clear any existing timeout to prevent multiple resets
            if (this.selectionTimeout) {
                clearTimeout(this.selectionTimeout);
            }

            // Set the selected slice temporarily
            this.selectedSlice = slice;

            // Automatically clear the selection after a brief delay (750ms)
            this.selectionTimeout = setTimeout(() => {
                this.selectedSlice = null;
            }, 750);
        },
        getLegendBackgroundColor(slice, index) {
            const baseColor = this.colorPalette[index % this.colorPalette.length];
            return `${baseColor}22`; // Always use light background (22 is 13% opacity in hex)
        },
        
        getItemOpacity(slice) {
            // If there's an active/selected slice and this isn't it, reduce opacity
            if ((this.activeSlice || this.selectedSlice) && 
                slice !== this.activeSlice && 
                slice !== this.selectedSlice) {
                return '0.6'; // Reduced opacity for non-active items
            }
            return '1'; // Full opacity for active/selected or when nothing is active
        },
        setTimeRange(range) {
            this.timeRange = range;
            this.updateChartData();
        },
        getColorForCategory(category) {
            // Find the index of the category in the current pie data
            const index = this.expensePieData.findIndex(slice => slice.category === category);
            if (index >= 0) {
                return this.colorPalette[index % this.colorPalette.length];
            }
            return '#6B7280'; // Default color (gray-500)
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
        getAssetPercentage(asset) {
            const totalAssets = this.$store.state.assets.reduce((sum, a) => {
                if (a.type !== 'loan') {
                    return sum + a.balance;
                }
                return sum;
            }, 0);
            return totalAssets > 0 ? (asset.balance / totalAssets) * 100 : 0;
        },
        addTransaction() {
            this.$store.dispatch('showModal');
        }
    },
    mounted() {
        this.updateChartData();
    },
    // Clean up timeout when component is destroyed
    beforeUnmount() {
        if (this.selectionTimeout) {
            clearTimeout(this.selectionTimeout);
        }
    }
}
</script>

<style scoped>
/* Add animation for legend items */
.ring-2 {
    box-shadow: 0 0 0 2px currentColor;
}

.ring-offset-1 {
    box-shadow: 0 0 0 1px white, 0 0 0 3px currentColor;
}
</style>