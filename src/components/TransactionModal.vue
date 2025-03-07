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

                <div v-if="form.type === 'transfer'" class="space-y-4">
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
                        <label for="platform" class="block text-gray-700 mb-1 text-sm font-medium">Platform</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i class="fas fa-building"></i>
                            </span>
                            <select id="platform" v-model="form.platform"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                                <option value="bank">Bank Transfer</option>
                                <option value="ewallet">E-Wallet</option>
                                <option value="tunai">Tunai</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            <span
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
                                <i class="fas fa-chevron-down"></i>
                            </span>
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

                <div v-if="form.type !== 'transfer'" id="categoryField">
                    <label for="category" class="block text-gray-700 mb-1 text-sm font-medium">Kategori</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <i class="fas fa-tag"></i>
                        </span>
                        <select id="category" v-model="form.category"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                            <option value="makanan">Makanan</option>
                            <option value="transportasi">Transportasi</option>
                            <option value="belanja">Belanja</option>
                            <option value="hiburan">Hiburan</option>
                            <option value="utilitas">Utilitas</option>
                            <option value="gaji">Gaji</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                        <span
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
                            <i class="fas fa-chevron-down"></i>
                        </span>
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
            form: {
                type: 'income',
                description: '',
                amount: '',
                date: new Date().toISOString().substr(0, 10),
                category: 'makanan',
                recipient: '',
                platform: 'bank',
                adminFee: 0
            }
        }
    },
    computed: {
        showModal() {
            return this.$store.state.showModal;
        },
        isEditing() {
            return this.$store.state.editingTransactionId !== null;
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
            } else if (val) {
                // Reset form for new transaction
                this.resetForm();
            }

            if (val) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },
    methods: {
        resetForm() {
            this.form = {
                type: 'income',
                description: '',
                amount: '',
                date: new Date().toISOString().substr(0, 10),
                category: 'makanan',
                recipient: '',
                platform: 'bank',
                adminFee: 0
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
                adminFee: Number(this.form.adminFee || 0)
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

            return true;
        }
    }
}
</script>