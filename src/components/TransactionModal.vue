<!-- src/components/TransactionModal.vue -->
<template>
    <div id="transactionModal" class="modal" :style="{ display: showModal ? 'block' : 'none' }">
        <div class="modal-content p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800">{{ isEditing ? 'Edit Transaksi' : 'Tambah Transaksi' }}
                </h2>
                <button class="close-modal text-gray-500 hover:text-gray-800" @click="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form @submit.prevent="saveTransaction" class="space-y-4">
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2 text-sm font-medium">Tipe Transaksi</label>
                    <div class="flex flex-col md:flex-row gap-3">
                        <label
                            class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors flex-1"
                            :class="{ 'bg-green-50 border-green-200': form.type === 'income' }">
                            <input type="radio" name="type" value="income" class="form-radio text-green-600 mr-2 hidden"
                                v-model="form.type">
                            <span class="text-green-600 mr-2"><i class="fas fa-arrow-down"></i></span>
                            <span class="font-medium">Pemasukan</span>
                        </label>
                        <label
                            class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors flex-1"
                            :class="{ 'bg-red-50 border-red-200': form.type === 'expense' }">
                            <input type="radio" name="type" value="expense" class="form-radio text-red-600 mr-2 hidden"
                                v-model="form.type">
                            <span class="text-red-600 mr-2"><i class="fas fa-arrow-up"></i></span>
                            <span class="font-medium">Pengeluaran</span>
                        </label>
                        <label
                            class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors flex-1"
                            :class="{ 'bg-blue-50 border-blue-200': form.type === 'transfer' }">
                            <input type="radio" name="type" value="transfer"
                                class="form-radio text-blue-600 mr-2 hidden" v-model="form.type">
                            <span class="text-blue-600 mr-2"><i class="fas fa-exchange-alt"></i></span>
                            <span class="font-medium">Transfer</span>
                        </label>
                    </div>
                </div>

                <!-- Pilih Aset untuk transaksi pemasukan dan pengeluaran -->
                <div v-if="form.type !== 'transfer'">
                    <label for="assetId" class="block text-gray-700 mb-1 text-sm font-medium">Aset</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-wallet"></i>
                        </span>
                        <div id="assetId" @click="showAssetDropdown = !showAssetDropdown"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer flex justify-between items-center">
                            <span>{{ getAssetLabel }}</span>
                            <i class="fas fa-chevron-down text-gray-500"></i>
                        </div>
                        <div v-if="showAssetDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <div v-for="asset in assets" :key="asset.id"
                                @click="selectAsset(asset.id)"
                                class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                                {{ asset.name }} (Rp {{ formatNumber(asset.balance) }})
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="form.type === 'transfer'" class="space-y-4">
                    <!-- Pilih Aset sumber (uang keluar) -->
                    <div>
                        <label for="sourceAssetId" class="block text-gray-700 mb-1 text-sm font-medium">Uang Keluar Dari</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i class="fas fa-wallet"></i>
                            </span>
                            <div id="sourceAssetId" @click="showSourceAssetDropdown = !showSourceAssetDropdown"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer flex justify-between items-center">
                                <span>{{ getSourceAssetLabel }}</span>
                                <i class="fas fa-chevron-down text-gray-500"></i>
                            </div>
                            <div v-if="showSourceAssetDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div v-for="asset in assets" :key="asset.id"
                                    @click="selectSourceAsset(asset.id)"
                                    class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                                    {{ asset.name }} (Rp {{ formatNumber(asset.balance) }})
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pilih Aset tujuan (uang masuk) -->
                    <div>
                        <label for="targetAssetId" class="block text-gray-700 mb-1 text-sm font-medium">Uang Masuk Ke</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i class="fas fa-wallet"></i>
                            </span>
                            <div id="targetAssetId" @click="showTargetAssetDropdown = !showTargetAssetDropdown"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer flex justify-between items-center">
                                <span>{{ getTargetAssetLabel }}</span>
                                <i class="fas fa-chevron-down text-gray-500"></i>
                            </div>
                            <div v-if="showTargetAssetDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div v-for="asset in assets" :key="asset.id"
                                    @click="selectTargetAsset(asset.id)"
                                    class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    :class="{ 'opacity-50 cursor-not-allowed': asset.id === form.sourceAssetId }">
                                    {{ asset.name }} (Rp {{ formatNumber(asset.balance) }})
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="recipient" class="block text-gray-700 mb-1 text-sm font-medium">Penerima</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i class="fas fa-user"></i>
                            </span>
                            <input type="text" id="recipient" v-model="form.recipient"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        </div>
                    </div>

                    <div>
                        <label for="adminFee" class="block text-gray-700 mb-1 text-sm font-medium">Biaya Admin
                            (Rp)</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i class="fas fa-coins"></i>
                            </span>
                            <input type="number" id="adminFee" v-model="form.adminFee"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        </div>
                    </div>
                    
                    <!-- Checkbox untuk transfer antar bank -->
                    <div v-if="isInterBankTransfer">
                        <div class="flex items-center mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <input type="checkbox" id="recordAsExpense" v-model="form.recordAsExpense"
                                class="h-4 w-4 text-green-600 focus:ring-green-500 rounded">
                            <label for="recordAsExpense" class="ml-2 block text-gray-700 text-sm">
                                Catat sebagai pengeluaran
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="description" class="block text-gray-700 mb-1 text-sm font-medium">Deskripsi</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-edit"></i>
                        </span>
                        <input type="text" id="description" v-model="form.description"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                    </div>
                </div>

                <div>
                    <label for="amount" class="block text-gray-700 mb-1 text-sm font-medium">Jumlah (Rp)</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-coins"></i>
                        </span>
                        <input type="number" id="amount" v-model="form.amount"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                    </div>
                </div>

                <div v-if="form.type !== 'transfer' || (isInterBankTransfer && form.recordAsExpense)" id="categoryField">
                    <label for="category" class="block text-gray-700 mb-1 text-sm font-medium">Kategori</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-tag"></i>
                        </span>
                        <div id="category" @click="showCategoryDropdown = !showCategoryDropdown"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer flex justify-between items-center">
                            <span>{{ getCategoryLabel }}</span>
                            <i class="fas fa-chevron-down text-gray-500"></i>
                        </div>
                        <div v-if="showCategoryDropdown" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <div v-for="option in categoryOptions" :key="option.value"
                                @click="selectCategory(option.value)"
                                class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                                {{ option.label }}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="date" class="block text-gray-700 mb-1 text-sm font-medium">Tanggal</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-calendar"></i>
                        </span>
                        <input type="date" id="date" v-model="form.date"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-6">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Perbarui Transaksi' : 'Simpan Transaksi' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TransactionModal',
    data() {
        return {
            showCategoryDropdown: false,
            showAssetDropdown: false,
            showSourceAssetDropdown: false,
            showTargetAssetDropdown: false,
            form: {
                type: 'income',
                description: '',
                amount: '',
                date: new Date().toISOString().substr(0, 10),
                category: 'makanan',
                recipient: '',
                adminFee: 0,
                assetId: 'cash',
                recordAsExpense: false,
                sourceAssetId: 'cash',
                targetAssetId: 'bank',
            },
            categoryOptions: [
                { value: 'makanan', label: 'Makanan' },
                { value: 'transportasi', label: 'Transportasi' },
                { value: 'belanja', label: 'Belanja' },
                { value: 'hiburan', label: 'Hiburan' },
                { value: 'utilitas', label: 'Utilitas' },
                { value: 'gaji', label: 'Gaji' },
                { value: 'lainnya', label: 'Lainnya' }
            ]
        }
    },
    mounted() {
        document.addEventListener('click', this.handleOutsideClick);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    },
    computed: {
        assets() {
            return this.$store.state.assets;
        },
        getCategoryLabel() {
            const category = this.categoryOptions.find(option => option.value === this.form.category);
            return category ? category.label : 'Pilih Kategori';
        },
        getAssetLabel() {
            const asset = this.assets.find(asset => asset.id === this.form.assetId);
            return asset ? asset.name : 'Pilih Aset';
        },
        getSourceAssetLabel() {
            const asset = this.assets.find(asset => asset.id === this.form.sourceAssetId);
            return asset ? asset.name : 'Pilih Aset Sumber';
        },
        getTargetAssetLabel() {
            const asset = this.assets.find(asset => asset.id === this.form.targetAssetId);
            return asset ? asset.name : 'Pilih Aset Tujuan';
        },
        showModal() {
            return this.$store.state.showModal;
        },
        isEditing() {
            return this.$store.state.editingTransactionId !== null;
        },
        isInterBankTransfer() {
            // Periksa apakah kedua asset bertipe 'bank'
            const sourceAsset = this.assets.find(asset => asset.id === this.form.sourceAssetId);
            const targetAsset = this.assets.find(asset => asset.id === this.form.targetAssetId);
            return sourceAsset?.type === 'bank' && targetAsset?.type === 'bank';
        },
        editingTransaction() {
            if (!this.isEditing) return null;

            return this.$store.state.transactions.find(
                t => t.id === this.$store.state.editingTransactionId
            );
        }
    },
    watch: {
        showModal(val) {
            if (val && this.isEditing && this.editingTransaction) {
                // Populate form with editing transaction data
                this.form = { ...this.editingTransaction };
                
                // Set default values for assetId, sourceAssetId, targetAssetId if not present
                if (!this.form.assetId && this.form.type !== 'transfer') {
                    this.form.assetId = 'cash';
                }
                
                if (!this.form.sourceAssetId && this.form.type === 'transfer') {
                    this.form.sourceAssetId = 'cash';
                }
                
                if (!this.form.targetAssetId && this.form.type === 'transfer') {
                    this.form.targetAssetId = 'bank';
                }
            } else if (val) {
                // Reset form for new transaction
                this.resetForm();
            }

            if (val) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },
        'form.sourceAssetId': function() {
            // Reset recordAsExpense ketika asset sumber berubah
            this.form.recordAsExpense = false;
        },
        'form.targetAssetId': function() {
            // Reset recordAsExpense ketika asset tujuan berubah
            this.form.recordAsExpense = false;
        }
    },
    methods: {
        formatNumber(number) {
            return number.toLocaleString('id-ID').replace(/,/g, ".");
        },
        resetForm() {
            this.form = {
                type: 'income',
                description: '',
                amount: '',
                date: new Date().toISOString().substr(0, 10),
                category: 'makanan',
                recipient: '',
                adminFee: 0,
                recordAsExpense: false,
                assetId: 'cash',
                sourceAssetId: 'cash',
                targetAssetId: 'bank'
            };
        },
        closeModal() {
            this.$store.dispatch('hideModal');
        },
        saveTransaction() {
            // Validate
            if (!this.validateForm()) return;

            // Create transaction object
            const transaction = {
                ...this.form,
                amount: Number(this.form.amount),
                adminFee: Number(this.form.adminFee || 0),
                recordAsExpense: this.form.recordAsExpense
            };

            if (this.isEditing) {
                this.$store.dispatch('updateTransaction', {
                    id: this.$store.state.editingTransactionId,
                    data: transaction
                });
            } else {
                this.$store.dispatch('addTransaction', transaction);
            }

            this.closeModal();
        },
        validateForm() {
            // Basic validation
            if (!this.form.description || !this.form.amount || !this.form.date) {
                alert('Harap isi semua field yang diperlukan');
                return false;
            }

            if (this.form.amount <= 0) {
                alert('Jumlah harus lebih dari 0');
                return false;
            }

            if (this.form.type === 'transfer' && !this.form.recipient) {
                alert('Penerima harus diisi untuk transaksi transfer');
                return false;
            }

            if (this.form.type === 'transfer' && this.form.sourceAssetId === this.form.targetAssetId) {
                // Cek apakah kedua aset adalah bank
                const sourceAsset = this.assets.find(asset => asset.id === this.form.sourceAssetId);
                const targetAsset = this.assets.find(asset => asset.id === this.form.targetAssetId);
                
                // Jika keduanya adalah bank, izinkan transfer (untuk kasus transfer antar rekening di bank yang sama)
                if (sourceAsset?.type === 'bank' && targetAsset?.type === 'bank') {
                    return true;
                }
                
                alert('Aset sumber dan tujuan tidak boleh sama');
                return false;
            }

            return true;
        },
        handleOutsideClick(event) {
            const categoryElement = document.getElementById('category');
            if (categoryElement && !categoryElement.contains(event.target) && this.showCategoryDropdown) {
                this.showCategoryDropdown = false;
            }
            
            const assetElement = document.getElementById('assetId');
            if (assetElement && !assetElement.contains(event.target) && this.showAssetDropdown) {
                this.showAssetDropdown = false;
            }
            
            const sourceAssetElement = document.getElementById('sourceAssetId');
            if (sourceAssetElement && !sourceAssetElement.contains(event.target) && this.showSourceAssetDropdown) {
                this.showSourceAssetDropdown = false;
            }
            
            const targetAssetElement = document.getElementById('targetAssetId');
            if (targetAssetElement && !targetAssetElement.contains(event.target) && this.showTargetAssetDropdown) {
                this.showTargetAssetDropdown = false;
            }
        },
        selectCategory(value) {
            this.form.category = value;
            this.showCategoryDropdown = false;
        },
        selectAsset(value) {
            this.form.assetId = value;
            this.showAssetDropdown = false;
        },
        selectSourceAsset(value) {
            this.form.sourceAssetId = value;
            this.showSourceAssetDropdown = false;
        },
        selectTargetAsset(value) {
            if (value !== this.form.sourceAssetId) {
                this.form.targetAssetId = value;
                this.showTargetAssetDropdown = false;
            }
        }
    }
}
</script>