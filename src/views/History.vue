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
                            <button @click="exportToCSV()" 
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                                <i class="fas fa-file-csv mr-2 text-green-600"></i> Export CSV
                            </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <button @click="showGoogleSheetsModal()" 
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex w-full items-center px-4 py-3 text-left text-sm']">
                                <i class="fas fa-file-excel mr-2 text-green-600"></i> Export Spreadsheet
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
    
    <!-- Google Sheets Export Modal -->
    <div id="sheetsExportModal" class="modal" :style="{ display: showSheetsModal ? 'block' : 'none' }" @click.self="closeSheetsModal">
        <div class="modal-content p-6 max-w-md">
            <button @click="closeSheetsModal" class="close-modal text-gray-500 hover:text-gray-800">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="text-center mb-6">
                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-file-excel text-green-600 text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Export ke Spreadsheet</h3>
                <p class="text-gray-600 mt-2">Masukkan link Google Sheets Anda untuk mengekspor data transaksi.</p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label for="sheetsUrl" class="block text-gray-700 mb-1 text-sm font-medium">Link Google Sheets</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-link"></i>
                        </span>
                        <input type="text" id="sheetsUrl" v-model="sheetsUrl" placeholder="https://docs.google.com/spreadsheets/d/..."
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        Pastikan spreadsheet dapat diakses untuk menulis data (hak akses Edit).
                    </p>
                </div>
                
                <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 class="font-medium text-blue-800 mb-1">Langkah untuk membuat Google Sheets:</h4>
                    <ol class="text-sm text-blue-700 pl-5 list-decimal">
                        <li>Buka <a href="https://docs.google.com/spreadsheets" target="_blank" class="underline">Google Sheets</a></li>
                        <li>Buat spreadsheet baru</li>
                        <li>Klik tombol Share di kanan atas</li>
                        <li>Ubah akses menjadi "Anyone with the link can edit"</li>
                        <li>Salin link dan tempel di sini</li>
                    </ol>
                </div>
                
                <div class="pt-2">
                    <button 
                        @click="exportToGoogleSheets" 
                        :disabled="!isValidSheetsUrl"
                        :class="[
                            'w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center',
                            isValidSheetsUrl 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        ]">
                        <i class="fas fa-file-export mr-2"></i>
                        Export Data
                    </button>
                </div>
            </div>
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
            showDeleteConfirmation: false,
            deleteTransactionId: null,
            transactionToDelete: null,
            showSheetsModal: false,
            sheetsUrl: '',
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
        isValidSheetsUrl() {
            return this.sheetsUrl.trim() !== '' && 
                  (this.sheetsUrl.includes('docs.google.com/spreadsheets') || this.sheetsUrl.includes('sheets.google.com'));
        }
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
        showGoogleSheetsModal() {
            this.showSheetsModal = true;
            document.body.style.overflow = 'hidden';
        },
        closeSheetsModal() {
            this.showSheetsModal = false;
            document.body.style.overflow = '';
        },
        exportToGoogleSheets() {
            if (!this.isValidSheetsUrl) {
                alert('Mohon masukkan URL Google Sheets yang valid.');
                return;
            }
            
            // Validasi URL berhasil, proses ekspor bisa dilanjutkan
            // Dalam implementasi nyata, ini bisa menggunakan Google Sheets API
            
            // Untuk demo, kita akan menampilkan pesan sukses saja
            alert('Transaksi berhasil diekspor ke Google Sheets.\n\nCatatan: Dalam aplikasi sebenarnya, ini akan terhubung ke Google Sheets API untuk mengunggah data Anda.');
            
            // Simpan URL sheet ke local storage untuk penggunaan mendatang
            localStorage.setItem('lastUsedGoogleSheetUrl', this.sheetsUrl);
            
            this.closeSheetsModal();
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

/* Google Sheets Modal Styles */
.modal-content.max-w-md {
    max-width: 28rem;
}

.list-decimal {
    list-style-type: decimal;
}

#sheetsExportModal a {
    color: #1a73e8;
    font-weight: 500;
    text-decoration: underline;
}
</style>