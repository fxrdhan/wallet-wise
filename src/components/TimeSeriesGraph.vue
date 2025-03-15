<!-- src/components/TimeSeriesGraph.vue -->
<template>
    <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden mt-6">
        <div class="flex items-center justify-between mb-6 relative z-10">
            <h2 class="text-lg font-semibold text-gray-800">Grafik Transaksi</h2>
            <div class="flex space-x-2">
                <!-- Date range picker -->
                <div class="flex items-center space-x-2 text-sm">
                    <button @click="showDatePicker = !showDatePicker"
                        class="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors flex items-center">
                        <i class="fas fa-calendar-alt mr-2 text-gray-500"></i>
                        {{ formatDateRange }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Date Range Picker Popup -->
        <div v-if="showDatePicker"
            class="absolute right-6 top-16 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
            <div class="flex flex-col space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                    <input type="date" v-model="startDate" class="border border-gray-300 rounded-md px-3 py-2 w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                    <input type="date" v-model="endDate" class="border border-gray-300 rounded-md px-3 py-2 w-full" />
                </div>
                <div class="flex justify-between">
                    <button @click="applyDateRange"
                        class="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Terapkan
                    </button>
                    <button @click="showDatePicker = false"
                        class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Batal
                    </button>
                </div>
                <div class="border-t border-gray-200 pt-3 mt-2">
                    <p class="text-sm font-medium text-gray-700 mb-2">Pilihan Cepat:</p>
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="setDateRange('week')"
                            class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                            1 Minggu
                        </button>
                        <button @click="setDateRange('month')"
                            class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                            1 Bulan
                        </button>
                        <button @click="setDateRange('quarter')"
                            class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                            3 Bulan
                        </button>
                        <button @click="setDateRange('year')"
                            class="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                            1 Tahun
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toggle between income, expense, or both -->
        <div class="flex mb-4 bg-gray-100 p-1 rounded-lg inline-flex">
            <button @click="activeDataType = 'both'" :class="[
                'px-3 py-1 text-sm rounded transition-colors flex-1',
                activeDataType === 'both' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
            ]">
                Semua
            </button>
            <button @click="activeDataType = 'income'" :class="[
                'px-3 py-1 text-sm rounded transition-colors flex-1',
                activeDataType === 'income' ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:bg-gray-200'
            ]">
                Pemasukan
            </button>
            <button @click="activeDataType = 'expense'" :class="[
                'px-3 py-1 text-sm rounded transition-colors flex-1',
                activeDataType === 'expense' ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:bg-gray-200'
            ]">
                Pengeluaran
            </button>
        </div>

        <!-- Graph Container -->
        <div class="mt-4 h-64 relative" ref="graphContainer">
            <!-- Graph will be rendered here -->
            <!-- Placeholder otomatis ditangani di dalam renderGraph() -->
        </div>

        <!-- Legend -->
        <div class="flex justify-center mt-4 space-x-6">
            <div class="flex items-center" v-if="activeDataType === 'both' || activeDataType === 'income'">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Pemasukan</span>
            </div>
            <div class="flex items-center" v-if="activeDataType === 'both' || activeDataType === 'expense'">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Pengeluaran</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimeSeriesGraph',
    data() {
        return {
            showDatePicker: false,
            startDate: this.getDateBefore(7), // 1 week ago by default
            endDate: new Date().toISOString().substr(0, 10), // Today
            tempStartDate: '', // For temporary storage while picking
            tempEndDate: '', // For temporary storage while picking
            activeDataType: 'both', // 'income', 'expense', or 'both'
            graphData: [],
            hasData: false,
        };
    },
    computed: {
        transactions() {
            return this.$store.state.transactions;
        },
        filteredTransactions() {
            const start = new Date(this.startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(this.endDate);
            end.setHours(23, 59, 59, 999);

            return this.transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= start && transactionDate <= end;
            });
        },
        formatDateRange() {
            const startDateObj = new Date(this.startDate);
            const endDateObj = new Date(this.endDate);

            const formatDate = (date) => {
                return `${date.getDate()} ${this.getMonthName(date.getMonth())} ${date.getFullYear()}`;
            };

            return `${formatDate(startDateObj)} - ${formatDate(endDateObj)}`;
        }
    },
    methods: {
        getDateBefore(days) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date.toISOString().substr(0, 10);
        },
        getMonthName(month) {
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            return months[month];
        },
        setDateRange(range) {
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            switch (range) {
                case 'week':
                    this.startDate = this.getDateBefore(7);
                    break;
                case 'month':
                    this.startDate = this.getDateBefore(30);
                    break;
                case 'quarter':
                    this.startDate = this.getDateBefore(90);
                    break;
                case 'year':
                    this.startDate = this.getDateBefore(365);
                    break;
            }

            this.endDate = new Date().toISOString().substr(0, 10);
            this.applyDateRange();
        },
        applyDateRange() {
            this.showDatePicker = false;
            this.prepareGraphData();
            this.renderGraph();
        },
        prepareGraphData() {
            // Group transactions by date
            const groupedByDate = {};
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);

            // Pastikan tanggal valid
            if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
                this.graphData = [];
                this.hasData = false;
                return;
            }

            // Initialize with all dates in range
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                groupedByDate[dateStr] = { date: dateStr, income: 0, expense: 0 };
            }

            // Fill with actual transaction data
            this.filteredTransactions.forEach(transaction => {
                const dateStr = new Date(transaction.date).toISOString().split('T')[0];

                if (!groupedByDate[dateStr]) {
                    groupedByDate[dateStr] = { date: dateStr, income: 0, expense: 0 };
                }

                if (transaction.type === 'income') {
                    groupedByDate[dateStr].income += transaction.amount;
                } else if (transaction.type === 'expense') {
                    groupedByDate[dateStr].expense += transaction.amount;
                } else if (transaction.type === 'transfer' && transaction.adminFee) {
                    // Count transfer admin fees as expenses
                    groupedByDate[dateStr].expense += transaction.adminFee;
                }
            });

            // Convert to array and sort by date
            this.graphData = Object.values(groupedByDate).sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

            this.hasData = this.graphData.some(item =>
                (this.activeDataType === 'income' || this.activeDataType === 'both') && item.income > 0 ||
                (this.activeDataType === 'expense' || this.activeDataType === 'both') && item.expense > 0
            );
        },
        renderGraph() {
            // Pastikan komponen sudah ter-mount dan ada referensi ke container
            const container = this.$refs.graphContainer;
            if (!container) return;

            // Clear previous graph
            container.innerHTML = '';

            // Jika tidak ada data, tampilkan pesan kosong dan berhenti
            if (!this.hasData) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'absolute inset-0 flex items-center justify-center';
                emptyMessage.innerHTML = '<p class="text-gray-500 text-sm">Tidak ada data untuk rentang waktu ini</p>';
                container.appendChild(emptyMessage);
                return;
            }

            // Create SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.overflow = 'visible';
            container.appendChild(svg);

            // Get dimensions
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Padding
            const padding = {
                top: 20,
                right: 20,
                bottom: 40,
                left: 60
            };

            // Calculate max value for scaling
            let maxValue = 0;
            this.graphData.forEach(item => {
                let dayTotal = 0;
                if (this.activeDataType === 'income' || this.activeDataType === 'both') {
                    dayTotal += item.income;
                }
                if (this.activeDataType === 'expense' || this.activeDataType === 'both') {
                    dayTotal += item.expense;
                }
                maxValue = Math.max(maxValue, dayTotal);
            });

            // Add 10% padding to max value
            maxValue = maxValue * 1;

            // Scale functions
            const xScale = (index) => {
                return padding.left + (index / (this.graphData.length - 1)) * (width - padding.left - padding.right);
            };

            const yScale = (value) => {
                return height - padding.bottom - (value / maxValue) * (height - padding.top - padding.bottom);
            };

            // Draw axes
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xAxis.setAttribute('x1', padding.left);
            xAxis.setAttribute('y1', height - padding.bottom);
            xAxis.setAttribute('x2', width - padding.right);
            xAxis.setAttribute('y2', height - padding.bottom);
            xAxis.setAttribute('stroke', '#e5e7eb');
            xAxis.setAttribute('stroke-width', '1');
            svg.appendChild(xAxis);

            const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            yAxis.setAttribute('x1', padding.left);
            yAxis.setAttribute('y1', padding.top);
            yAxis.setAttribute('x2', padding.left);
            yAxis.setAttribute('y2', height - padding.bottom);
            yAxis.setAttribute('stroke', '#e5e7eb');
            yAxis.setAttribute('stroke-width', '1');
            svg.appendChild(yAxis);

            // Draw horizontal grid lines
            const numGridLines = 5;
            for (let i = 0; i <= numGridLines; i++) {
                const y = yScale((maxValue / numGridLines) * i);
                const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                gridLine.setAttribute('x1', padding.left);
                gridLine.setAttribute('y1', y);
                gridLine.setAttribute('x2', width - padding.right);
                gridLine.setAttribute('y2', y);
                gridLine.setAttribute('stroke', '#f3f4f6');
                gridLine.setAttribute('stroke-width', '1');
                svg.appendChild(gridLine);

                // Y-axis labels
                const value = Math.round((maxValue / numGridLines) * i);
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', padding.left - 10);
                label.setAttribute('y', y + 5);
                label.setAttribute('text-anchor', 'end');
                label.setAttribute('font-size', '10');
                label.setAttribute('fill', '#6b7280');
                label.textContent = this.formatCurrency(value);
                svg.appendChild(label);
            }

            // Menghitung lebar bar (satu bar untuk income dan expense)
            const barWidth = Math.min(50, (width - padding.left - padding.right) / Math.max(1, this.graphData.length) * 0.7);

            // Offset untuk memisahkan bar dari sumbu y
            const leftOffset = 15;

            // Periksa jika graphData ada dan tidak kosong
            if (!this.graphData || this.graphData.length === 0) return;

            this.graphData.forEach((item, index) => {
                // X-axis labels (dates)
                if (this.graphData.length <= 14 || index % Math.ceil(this.graphData.length / 7) === 0) {
                    const date = new Date(item.date);
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', xScale(index) + leftOffset);
                    label.setAttribute('y', height - padding.bottom + 20);
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('font-size', '10');
                    label.setAttribute('fill', '#6b7280');
                    label.textContent = `${date.getDate()}/${date.getMonth() + 1}`;
                    svg.appendChild(label);
                }

                // Expense bar (render first)
                if ((this.activeDataType === 'expense' || this.activeDataType === 'both') && item.expense > 0) {
                    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bar.setAttribute('x', xScale(index) - barWidth / 2 + leftOffset);
                    bar.setAttribute('y', yScale(item.expense));
                    bar.setAttribute('width', barWidth);
                    bar.setAttribute('height', height - padding.bottom - yScale(item.expense));
                    bar.setAttribute('fill', 'rgba(239, 68, 68, 0.8)'); // Semi-transparent Red
                    bar.setAttribute('rx', '2');
                    bar.setAttribute('ry', '2');

                    // Add tooltip on hover
                    bar.addEventListener('mouseover', (e) => this.showTooltip(e, item, 'expense'));
                    bar.addEventListener('mouseout', this.hideTooltip);

                    svg.appendChild(bar);
                }

                // Income bar (render last to appear on top)
                if ((this.activeDataType === 'income' || this.activeDataType === 'both') && item.income > 0) {
                    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bar.setAttribute('x', xScale(index) - barWidth / 2 + leftOffset);
                    bar.setAttribute('y', yScale(item.income));
                    bar.setAttribute('width', barWidth);
                    bar.setAttribute('height', height - padding.bottom - yScale(item.income));
                    bar.setAttribute('fill', 'rgba(16, 185, 129, 0.8)'); // Semi-transparent Green
                    bar.setAttribute('rx', '2');
                    bar.setAttribute('ry', '2');

                    // Add tooltip on hover
                    bar.addEventListener('mouseover', (e) => this.showTooltip(e, item, 'income'));
                    bar.addEventListener('mouseout', this.hideTooltip);

                    svg.appendChild(bar);
                }
            });
        },
        formatCurrency(value) {
            if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}jt`;
            } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}rb`;
            }
            return value.toString();
        },
        showTooltip(event, item, type) {
            // Remove any existing tooltip
            this.hideTooltip();

            const container = this.$refs.graphContainer;
            const tooltip = document.createElement('div');
            tooltip.id = 'graph-tooltip';
            tooltip.className = 'absolute z-50 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm';

            const date = new Date(item.date);
            const formattedDate = `${date.getDate()} ${this.getMonthName(date.getMonth())} ${date.getFullYear()}`;

            tooltip.innerHTML = `
          <div class="font-medium">${formattedDate}</div>
          <div class="${type === 'income' ? 'text-green-600' : 'text-red-600'}">
            ${type === 'income' ? 'Pemasukan: ' : 'Pengeluaran: '}
            Rp ${this.formatNumber(type === 'income' ? item.income : item.expense)}
          </div>
        `;

            // Position tooltip
            const rect = event.target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - containerRect.top - 70}px`;
            tooltip.style.transform = 'translateX(-50%)';

            container.appendChild(tooltip);
        },
        hideTooltip() {
            const tooltip = document.getElementById('graph-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        },
        formatNumber(number) {
            return number.toLocaleString('id-ID').replace(/,/g, ".");
        },
    },
    mounted() {
        // Tunggu sampai DOM benar-benar di-render sebelum menginisialisasi grafik
        this.$nextTick(() => {
            this.prepareGraphData();
            this.renderGraph();
        });

        // Re-render on window resize
        window.addEventListener('resize', this.renderGraph);

        // Click outside date picker to close
        document.addEventListener('click', (e) => {
            const datePicker = this.$el.querySelector('.absolute.right-6.top-16');
            const datePickerButton = this.$el.querySelector('button[class*="px-3 py-1 bg-gray-100 rounded-lg"]');

            if (datePicker && !datePicker.contains(e.target) && !datePickerButton.contains(e.target)) {
                this.showDatePicker = false;
            }
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.renderGraph);
    },
    watch: {
        activeDataType() {
            this.$nextTick(() => {
                this.prepareGraphData();
                this.renderGraph();
            });
        },
        startDate() {
            this.$nextTick(() => {
                this.prepareGraphData();
                this.renderGraph();
            });
        },
        endDate() {
            this.$nextTick(() => {
                this.prepareGraphData();
                this.renderGraph();
            });
        }
    }
};
</script>

<style scoped>
/* Add custom styles if needed */
.graph-tooltip {
    pointer-events: none;
    transition: all 0.2s;
}
</style>