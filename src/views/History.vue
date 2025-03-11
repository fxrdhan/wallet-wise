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
                        <MenuItem v-slot="{ active }">
                        <button @click="importFromCSV()"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                            <i class="fas fa-file-csv mr-2 text-blue-600"></i> Import dari CSV
                        </button>
                        </MenuItem>
                    </DropdownMenu>
                    <DropdownMenu class="icon-only-dropdown">
                        <template #button-content>
                            <i class="fas fa-upload relative z-20"></i>
                        </template>
                        <MenuItem v-slot="{ active }">
                        <button @click="exportToCSV()"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                            <i class="fas fa-file-csv mr-2 text-green-600"></i> Export ke CSV
                        </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <button @click="exportToPDF()"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                            <i class="fas fa-file-pdf mr-2 text-red-600"></i> Export ke PDF
                        </button>
                        </MenuItem>
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
                                Aset</th>
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
                            <td colspan="6">
                                <div class="text-center py-8">
                                    <i class="fas fa-receipt text-gray-300 text-5xl mb-4"></i>
                                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                                    <p class="text-gray-500 mb-4">Tambahkan transaksi pertama Anda dengan menekan tombol
                                        + di bawah
                                    </p>
                                    <button @click="addTransaction"
                                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                                        <i class="fas fa-plus mr-2"></i> Tambah Transaksi
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                                formatDateSimple(transaction.date) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                                transaction.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span v-if="transaction.type !== 'transfer'">
                                    <i :class="getAssetIcon(getAssetType(transaction.assetId)) + ' mr-1'"></i> {{
                                        getAssetName(transaction.assetId) }}
                                </span>
                                <span v-else>
                                    <i :class="getAssetIcon(getAssetType(transaction.sourceAssetId)) + ' mr-1'"></i> {{
                                        getAssetName(transaction.sourceAssetId) }} →
                                    <i :class="getAssetIcon(getAssetType(transaction.targetAssetId)) + ' mr-1'"></i> {{
                                        getAssetName(transaction.targetAssetId) }}
                                </span>
                            </td>
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
                <div v-if="transactions.length === 0"
                    class="bg-white rounded-xl shadow-md p-6 card-hover transition-all text-center">
                    <i class="fas fa-receipt text-gray-300 text-5xl mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                    <p class="text-gray-500 mb-4">Tambahkan transaksi pertama Anda dengan menekan tombol + di bawah</p>
                    <button @click="addTransaction"
                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center">
                        <i class="fas fa-plus mr-2"></i> Tambah Transaksi
                    </button>
                </div>
                <div v-for="transaction in transactions" :key="transaction.id" class="transaction-card-wrapper mb-6">
                    <div class="bg-white rounded-t-lg border border-gray-200 shadow-sm p-4 relative overflow-hidden">
                        <div class="flex justify-between items-start">
                            <div class="flex-1 mr-4">
                                <h3 class="font-medium text-gray-900">{{ transaction.description }}</h3>
                                <p class="text-sm text-gray-500 capitalize">{{ getTransactionDetails(transaction) }}</p>
                                <p class="text-xs text-gray-400 mt-1">
                                    <span v-if="transaction.type !== 'transfer'">
                                        <i :class="getAssetIcon(getAssetType(transaction.assetId)) + ' mr-1'"></i>{{
                                            getAssetName(transaction.assetId) }}
                                    </span>
                                    <span v-else><i
                                            :class="getAssetIcon(getAssetType(transaction.sourceAssetId)) + ' mr-1'"></i>{{
                                                getAssetName(transaction.sourceAssetId) }}
                                        → <i
                                            :class="getAssetIcon(getAssetType(transaction.targetAssetId)) + ' mr-1'"></i>{{
                                                getAssetName(transaction.targetAssetId) }}</span>
                                </p>
                            </div>
                            <div :class="getAmountColorClass(transaction.type)" class="font-bold text-right">
                                {{ getAmountPrefix(transaction.type) }} Rp {{
                                    formatNumber(getTransactionTotal(transaction)) }}
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
    
    <!-- Import loading overlay -->
    <div v-if="showImportLoader" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg text-center">
            <div class="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Mengimpor Data</h3>
            <p class="text-gray-600">Mohon tunggu, sedang memproses data transaksi...</p>
            <p class="text-sm text-gray-500 mt-2">Ini mungkin memerlukan waktu beberapa saat.</p>
        </div>
    </div>
    
    <!-- Hidden input for file import -->
    <input type="file" ref="fileInput" accept=".csv" style="display: none" @change="handleFileSelected" />

    <!-- Confirmation Dialog - pindahkan ke luar komponen utama -->
    <div id="deleteConfirmationModal" class="modal" :style="{ display: showDeleteConfirmation ? 'block' : 'none' }"
        @click.self="cancelDelete">
        <div class="modal-content p-6">
            <button @click="cancelDelete" class="close-modal text-gray-500 hover:text-gray-800">
                <i class="fas fa-times"></i>
            </button>

            <div class="text-center mb-4">
                <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-trash-alt text-red-600 text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Konfirmasi Penghapusan</h3>
                <p class="text-gray-600 mt-2">Apakah Anda yakin ingin menghapus transaksi ini?</p>
                <div v-if="transactionToDelete" class="bg-gray-50 p-3 rounded-lg mt-3 text-left">
                    <p class="font-medium flex justify-between items-center">
                        <span>{{ transactionToDelete.description }}</span>
                        <span :class="getAmountColorClass(transactionToDelete.type)">
                            {{ getAmountPrefix(transactionToDelete.type) }} Rp {{
                                formatNumber(getTransactionTotal(transactionToDelete)) }}</span>
                    </p>
                    <p class="text-sm text-gray-500">{{ formatDateSimple(transactionToDelete.date) }}</p>
                </div>
            </div>
            <div class="flex space-x-3 justify-center">
                <button @click="cancelDelete"
                    class="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 font-medium">
                    Batal
                </button>
                <button @click="confirmDelete"
                    class="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium flex items-center">
                    <i class="fas fa-trash-alt mr-2"></i> Ya, Hapus
                </button>
            </div>
        </div>
    </div>

    <!-- PDF Export invisible container -->
    <div ref="pdfContent" class="pdf-export-container"></div>
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
            showDeleteConfirmation: false,
            deleteTransactionId: null,
            transactionToDelete: null,
            showImportLoader: false,
            filterAssetId: null,
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
                return 'Semua Riwayat';
            } else {
                const option = this.filterOptions.find(opt => opt.value === this.filterType);
                return option ? option.label : 'Riwayat Transaksi';
            }
        },
        transactions() {
            if (this.filterType !== 'all') {
                return this.$store.getters.sortedTransactions.filter(t => t.type === this.filterType);
            }

            // Jika ada filter aset, terapkan
            if (this.filterAssetId) {
                return this.$store.getters.sortedTransactions.filter(t =>
                    t.assetId === this.filterAssetId || t.sourceAssetId === this.filterAssetId || t.targetAssetId === this.filterAssetId);
            }

            return this.$store.getters.sortedTransactions;
        },
    },
    watch: {
        showDeleteConfirmation(val) {
            if (val) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
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
        addTransaction() {
            this.$store.dispatch('showModal');
        },
        editTransaction(id) {
            this.$store.dispatch('showModal', id);
        },
        deleteTransaction(id) {
            // Mencari data transaksi yang akan dihapus untuk ditampilkan dalam dialog
            const transaction = this.$store.getters.sortedTransactions.find(t => t.id === id);
            this.deleteTransactionId = id;
            this.transactionToDelete = transaction;
            this.showDeleteConfirmation = true;
        },
        confirmDelete() {
            if (this.deleteTransactionId) {
                this.$store.dispatch('deleteTransaction', this.deleteTransactionId);
                this.cancelDelete();
            }
        },
        cancelDelete() {
            this.showDeleteConfirmation = false;
            this.deleteTransactionId = null;
            this.transactionToDelete = null;
        },
        getAssetName(assetId) {
            const asset = this.$store.state.assets.find(a => a.id === assetId);
            return asset ? asset.name : 'Tidak Diketahui';
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
        getAssetType(assetId) {
            const asset = this.$store.state.assets.find(a => a.id === assetId);
            return asset ? asset.type : 'cash';
        },
        exportToCSV() {
            try {
                // Mendapatkan transaksi berdasarkan filter saat ini
                const transactionsToExport = this.transactions;

                if (transactionsToExport.length === 0) {
                    alert('Tidak ada data transaksi untuk diekspor.');
                    return;
                }

                // Menyiapkan header CSV
                const headers = [
                    'Tanggal',
                    'Deskripsi',
                    'Tipe',
                    'Kategori',
                    'Aset',
                    'Dari',
                    'Tujuan',
                    'Jumlah',
                    'Biaya Admin',
                    'Total'
                ];

                // Menyiapkan data CSV
                const csvRows = [];

                // Menambahkan header
                csvRows.push(headers.join(','));

                // Menambahkan data transaksi
                transactionsToExport.forEach(transaction => {
                    const row = [
                        this.formatDateSimple(transaction.date),
                        '"' + transaction.description.replace(/"/g, '""') + '"', // Menggunakan double quotes untuk menangani koma dalam teks
                        transaction.type === 'income' ? 'Pemasukan' :
                            transaction.type === 'expense' ? 'Pengeluaran' : 'Transfer',
                        transaction.category ? '"' + this.capitalizeFirstLetter(transaction.category) + '"' : '',
                        transaction.type !== 'transfer' ? this.getAssetName(transaction.assetId) : '',
                        transaction.type === 'transfer' ? this.getAssetName(transaction.sourceAssetId) : '',
                        transaction.type === 'transfer' ? this.getAssetName(transaction.targetAssetId) : '',
                        transaction.amount,
                        transaction.type === 'transfer' ? (transaction.adminFee || 0) : '',
                        this.getTransactionTotal(transaction)
                    ];

                    csvRows.push(row.join(','));
                });

                // Membuat konten CSV
                const csvContent = csvRows.join('\n');

                // Membuat Blob dan link download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);

                // Membuat link dan memicu download
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `wallet-wise-transaksi-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error exporting CSV:', error);
                alert('Terjadi kesalahan saat mengekspor data. Silakan coba lagi.');
            }
        },
        exportToPDF() {
            try {
                // Mendapatkan transaksi berdasarkan filter saat ini
                const transactionsToExport = this.transactions;

                if (transactionsToExport.length === 0) {
                    alert('Tidak ada data transaksi untuk diekspor.');
                    return;
                }

                // Membuat tampilan untuk PDF dengan data transaksi
                const pdfContainer = this.$refs.pdfContent;
                pdfContainer.innerHTML = '';

                // Membuat elemen style untuk styling PDF
                const style = document.createElement('style');
                style.textContent = `
                    .pdf-page {
                        font-family: Arial, sans-serif;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .pdf-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .pdf-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .pdf-subtitle {
                        font-size: 14px;
                        color: #666;
                    }
                    .pdf-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    .pdf-table th, .pdf-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    .pdf-table th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    .pdf-table tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .pdf-footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    .text-green { color: #22c55e; }
                    .text-red { color: #ef4444; }
                    .text-purple { color: #9333ea; }
                    
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .pdf-export-container, .pdf-export-container * {
                            visibility: visible;
                        }
                        .pdf-export-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .pdf-page {
                            width: 100%;
                            max-width: none;
                        }
                    }
                `;

                // Membuat konten PDF
                const pdfPage = document.createElement('div');
                pdfPage.className = 'pdf-page';

                // Header
                const header = document.createElement('div');
                header.className = 'pdf-header';

                const title = document.createElement('div');
                title.className = 'pdf-title';
                title.textContent = 'Laporan Transaksi Wallet Wise';

                const subtitle = document.createElement('div');
                subtitle.className = 'pdf-subtitle';
                subtitle.textContent = `Diekspor pada: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`;

                header.appendChild(title);
                header.appendChild(subtitle);

                // Tabel transaksi
                const table = document.createElement('table');
                table.className = 'pdf-table';

                // Header tabel
                const thead = document.createElement('thead');
                thead.innerHTML = `<tr>
                    <th>Tanggal</th>
                    <th>Deskripsi</th>
                    <th>Tipe</th>
                    <th>Kategori/Detail</th>
                    <th>Aset</th>
                    <th>Jumlah</th>
                </tr>`;

                // Isi tabel
                const tbody = document.createElement('tbody');

                transactionsToExport.forEach(transaction => {
                    const row = document.createElement('tr');

                    // Tentukan class warna berdasarkan tipe transaksi
                    const amountClass = transaction.type === 'income' ? 'text-green' :
                        transaction.type === 'expense' ? 'text-red' : 'text-purple';

                    const amountPrefix = transaction.type === 'income' ? '+' : '-';

                    row.innerHTML = `
                        <td>${this.formatDateSimple(transaction.date)}</td>
                        <td>${transaction.description}</td>
                        <td>${transaction.type === 'income' ? 'Pemasukan' :
                            transaction.type === 'expense' ? 'Pengeluaran' : 'Transfer'}</td>
                        <td>${this.getTransactionDetails(transaction)}</td>
                        <td>${transaction.type !== 'transfer' ?
                            this.getAssetName(transaction.assetId) :
                            `${this.getAssetName(transaction.sourceAssetId)} → ${this.getAssetName(transaction.targetAssetId)}`}</td>
                        <td class="${amountClass}">${amountPrefix} Rp ${this.formatNumber(this.getTransactionTotal(transaction))}</td>
                    `;

                    tbody.appendChild(row);
                });

                table.appendChild(thead);
                table.appendChild(tbody);

                // Footer
                const footer = document.createElement('div');
                footer.className = 'pdf-footer';
                footer.textContent = '© 2025 Wallet Wise - Aplikasi Pengelolaan Keuangan Pribadi';

                // Menggabungkan semua elemen
                pdfPage.appendChild(header);
                pdfPage.appendChild(table);
                pdfPage.appendChild(footer);

                pdfContainer.appendChild(style);
                pdfContainer.appendChild(pdfPage);

                // Simpan state aplikasi saat ini
                const originalOverflow = document.body.style.overflow;

                // Print PDF
                document.body.style.overflow = 'visible';
                window.print();

                // Kembalikan state aplikasi setelah print
                document.body.style.overflow = originalOverflow;

                // Bersihkan kontainer PDF
                setTimeout(() => {
                    pdfContainer.innerHTML = '';
                }, 500);
            } catch (error) {
                console.error('Error exporting PDF:', error);
                alert('Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.');
            }
        },
        importFromCSV() {
            // Trigger click pada input file
            this.$refs.fileInput.click();
        },
        handleFileSelected(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Baca file sebagai teks
            const reader = new FileReader();
            reader.readAsText(file);
            
            reader.onload = (e) => {
                try {
                    // Reset file input
                    this.$refs.fileInput.value = '';
                    
                    if (!e.target.result || e.target.result.trim() === '') {
                        throw new Error('File kosong atau tidak valid');
                    }
                    
                    // Parsing CSV
                    const csvContent = e.target.result;
                    const lines = csvContent.split('\n');
                    const headers = lines[0].split(',');
                    
                    // Validasi header minimal yang dibutuhkan
                    const requiredHeaders = ['Tanggal', 'Deskripsi', 'Tipe', 'Jumlah'];
                    const missingHeaders = requiredHeaders.filter(
                        header => !headers.includes(header)
                    );
                    
                    if (missingHeaders.length > 0) {
                        throw new Error(`File CSV tidak valid. Header yang diperlukan tidak ditemukan: ${missingHeaders.join(', ')}`);
                    }
                    
                    // Memproses baris data
                    const transactions = [];
                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue; // Lewati baris kosong
                        
                        // Split CSV dengan benar (menangani teks dengan koma)
                        const values = this.parseCSVLine(lines[i]);
                        
                        if (values.length !== headers.length) {
                            console.warn(`Baris ${i+1} memiliki jumlah kolom yang tidak sesuai dan akan dilewati`);
                            continue;
                        }
                        
                        // Buat objek dari header dan nilai
                        const rowData = {};
                        headers.forEach((header, index) => {
                            rowData[header] = values[index];
                        });
                        
                        // Konversi data ke format yang sesuai dengan store
                        const transaction = this.convertImportedRowToTransaction(rowData);
                        if (transaction) {
                            transactions.push(transaction);
                        }
                    }
                    
                    if (transactions.length === 0) {
                        throw new Error("Tidak ada transaksi valid yang ditemukan dalam file.");
                    }
                    
                    // Tampilkan konfirmasi
                    if (confirm(`Ditemukan ${transactions.length} transaksi. Impor data ini?`)) {
                        // Impor transaksi ke store
                        this.importTransactions(transactions);
                    }
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    alert(`Gagal mengimpor data: ${error.message}`);
                }
            };
            
            reader.onerror = () => {
                alert('Gagal membaca file. Silakan coba lagi.');
            };
        },
        parseCSVLine(line) {
            // Fungsi untuk memecah baris CSV dengan benar, menangani teks dalam tanda kutip
            const values = [];
            let inQuotes = false;
            let currentValue = '';
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            
            // Tambahkan nilai terakhir
            values.push(currentValue.trim());
            
            return values;
        },
        convertImportedRowToTransaction(rowData) {
            try {
                // Konversi format tanggal
                const dateParts = rowData['Tanggal'].split(' ');
                const day = parseInt(dateParts[0]);
                
                // Map bulan Indonesia ke angka
                const monthMap = {
                    'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
                    'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
                };
                
                const month = monthMap[dateParts[1]];
                const year = parseInt(dateParts[2]);
                
                if (isNaN(day) || month === undefined || isNaN(year)) {
                    throw new Error('Format tanggal tidak valid');
                }
                
                // Konversi tipe transaksi
                let type;
                switch (rowData['Tipe']) {
                    case 'Pemasukan': type = 'income'; break;
                    case 'Pengeluaran': type = 'expense'; break;
                    case 'Transfer': type = 'transfer'; break;
                    default: throw new Error('Tipe transaksi tidak valid');
                }
                
                // Bersihkan nilai jumlah (hapus format Rp dan tanda ribuan)
                const amount = parseFloat(rowData['Jumlah'].replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.'));
                if (isNaN(amount)) {
                    throw new Error('Jumlah tidak valid');
                }
                
                // Cari atau buat ID aset
                let assetId, sourceAssetId, targetAssetId;
                
                if (type !== 'transfer') {
                    // Untuk transaksi income/expense, cari aset dari nama
                    const assetName = rowData['Aset'];
                    const asset = this.$store.state.assets.find(a => a.name === assetName);
                    assetId = asset ? asset.id : 'cash'; // Default ke cash jika aset tidak ditemukan
                } else {
                    // Untuk transfer, cari aset sumber dan tujuan
                    const sourceAssetName = rowData['Dari'];
                    const targetAssetName = rowData['Tujuan'];
                    
                    const sourceAsset = this.$store.state.assets.find(a => a.name === sourceAssetName);
                    const targetAsset = this.$store.state.assets.find(a => a.name === targetAssetName);
                    
                    sourceAssetId = sourceAsset ? sourceAsset.id : 'cash';
                    targetAssetId = targetAsset ? targetAsset.id : 'bank';
                }
                
                // Buat objek transaksi
                const transaction = {
                    description: rowData['Deskripsi'],
                    amount: amount,
                    type: type,
                    date: new Date(year, month, day).toISOString(),
                    category: type !== 'transfer' ? (rowData['Kategori'] || 'lainnya').toLowerCase() : undefined
                };
                
                // Tambahkan properti berdasarkan tipe
                if (type !== 'transfer') {
                    transaction.assetId = assetId;
                } else {
                    transaction.sourceAssetId = sourceAssetId;
                    transaction.targetAssetId = targetAssetId;
                    
                    // Tambahkan biaya admin jika ada
                    if (rowData['Biaya Admin']) {
                        const adminFee = parseFloat(rowData['Biaya Admin'].replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.'));
                        if (!isNaN(adminFee)) {
                            transaction.adminFee = adminFee;
                        }
                    }
                }
                
                return transaction;
            } catch (error) {
                console.warn('Error converting row to transaction:', error, rowData);
                return null;
            }
        },
        importTransactions(transactions) {
            this.showImportLoader = true;
            
            // Cek duplikasi dan filter transaksi
            const existingTransactions = this.$store.state.transactions;
            const newTransactions = [];
            const duplicates = [];
            
            // Helper untuk memeriksa apakah transaksi serupa sudah ada
            const isSimilarTransaction = (t1, t2) => {
                // Bandingkan tanggal (tahun, bulan, hari), jumlah, deskripsi, dan tipe
                const date1 = new Date(t1.date);
                const date2 = new Date(t2.date);
                
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate() &&
                       t1.amount === t2.amount &&
                       t1.description === t2.description &&
                       t1.type === t2.type;
            };
            
            // Filter transaksi yang kemungkinan duplikat
            transactions.forEach(transaction => {
                const isDuplicate = existingTransactions.some(existing => isSimilarTransaction(existing, transaction));
                
                if (isDuplicate) {
                    duplicates.push(transaction);
                } else {
                    newTransactions.push(transaction);
                }
            });
            
            // Jika ada duplikat, konfirmasi dengan user
            if (duplicates.length > 0) {
                const confirmMessage = `Ditemukan ${duplicates.length} transaksi yang mungkin duplikat. Impor hanya ${newTransactions.length} transaksi baru?`;
                
                if (!confirm(confirmMessage)) {
                    this.showImportLoader = false;
                    return;
                }
            }
            
            // Jika tidak ada transaksi baru yang valid
            if (newTransactions.length === 0) {
                this.showImportLoader = false;
                alert('Tidak ada transaksi baru yang dapat diimpor.');
                return;
            }
            
            // Impor transaksi satu per satu untuk memastikan logika bisnis store berjalan
            newTransactions.forEach(transaction => {
                this.$store.dispatch('addTransaction', transaction);
            });
            
            setTimeout(() => {
                this.showImportLoader = false;
                alert(`Berhasil mengimpor ${newTransactions.length} transaksi baru.`);
            }, 500); // Delay kecil untuk animasi
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
i.fas.fa-history.text-gray-100 {
    z-index: 1;
}

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
    color: #374151;
    /* gray-700 */
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-stick:hover {
    transform: scaleX(1.1);
    opacity: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.edit-stick {
    background-color: #F97316;
    /* orange-500 */
}

.edit-stick:hover {
    background-color: #EA580C;
    /* orange-600 */
}

.delete-stick {
    background-color: #EF4444;
    /* red-500 */
}

.delete-stick:hover {
    background-color: #DC2626;
    /* red-600 */
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

/* PDF Export styles */
.pdf-export-container {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

@media print {
    .pdf-export-container {
        display: block;
    }
}
</style>