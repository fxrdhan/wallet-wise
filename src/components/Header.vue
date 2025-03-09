<!-- src/components/Header.vue -->
<template>
    <header class="mb-4 pt-4 transition-all overflow-hidden">
        <div class="p-4 flex flex-col md:flex-row justify-between items-center">
            <div>
                <div class="flex pl-4 items-center">
                    <i class="fas fa-wallet text-green-600 text-3xl mr-3"></i>
                    <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">Wallet Wise</h1>
                </div>
                <p class="text-gray-400 mt-1 text-sm ml-4">Aplikasi kelola keuangan Anda</p>
            </div>
            <div class="mt-4 md:mt-0 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                <p class="text-green-700 text-sm"><i class="far fa-calendar-alt mr-1"></i> <span>{{ currentDate }}</span></p>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: "AppNavbar",
    data() {
        return {
            currentDate: ""
        }
    },
    mounted() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.currentDate = new Date().toLocaleDateString('id-ID', options);
    }
}
</script>