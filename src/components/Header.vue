<!-- src/components/Header.vue -->
<template>
    <header class="mb-4 transition-all overflow-hidden">
        <div class="px-1 py-2 flex justify-between items-center">
            <!-- Desktop Version -->
            <div class="hidden md:block">
                <div class="flex items-center">
                    <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">Wallet Wise</h1>
                </div>
                <p class="text-gray-400 mt-1 text-sm">Aplikasi kelola keuangan Anda</p>
            </div>
            
            <!-- Mobile Version -->
            <div class="flex md:hidden w-full justify-between items-center">
                <!-- Left: User Profile & Greeting -->
                <div class="flex items-center">
                    <div class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <i class="fas fa-user text-gray-500"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-600">{{ greeting }}</p>
                        <p class="font-medium text-sm">Andriana</p>
                    </div>
                </div>
                
                <!-- Right: Title only -->
                <h1 class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">Wallet Wise</h1>
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
    computed: {
        greeting() {
            const hours = new Date().getHours();
            if (hours >= 5 && hours < 12) {
                return "Selamat pagi,";
            } else if (hours >= 12 && hours < 15) {
                return "Selamat siang,";
            } else if (hours >= 15 && hours < 19) {
                return "Selamat sore,";
            } else {
                return "Selamat malam,";
            }
        }
    },
    mounted() {}
}
</script>