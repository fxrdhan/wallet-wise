<!-- src/components/Navbar.vue -->
<template>
    <div class="navbar-bottom">
        <button class="add-button" @click="openModal">
            <i class="fas fa-plus"></i>
        </button>
        <div class="flex justify-around items-center pt-2">
            <router-link to="/" class="flex flex-col items-center" :class="getNavLinkClass('/')">
                <i class="fas fa-home text-xl"></i>
                <span class="text-xs mt-1">Beranda</span>
            </router-link>
            <router-link to="/statistics" class="flex flex-col items-center" :class="getNavLinkClass('/statistics')">
                <i class="fas fa-chart-pie text-xl"></i>
                <span class="text-xs mt-1">Statistik</span>
            </router-link>
            <div class="w-16"></div> <!-- Placeholder untuk tombol plus -->
            <router-link to="/history" class="flex flex-col items-center" :class="getNavLinkClass('/history')">
                <i class="fas fa-calendar-alt text-xl"></i>
                <span class="text-xs mt-1">Riwayat</span>
            </router-link>
            <router-link to="/profile" class="flex flex-col items-center" :class="getNavLinkClass('/profile')">
                <i class="fas fa-user text-xl"></i>
                <span class="text-xs mt-1">Profil</span>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppNavbar',
    methods: {
        getNavLinkClass(route) {
            return {
                'text-green-600 opacity-90 hover:opacity-100': this.$route.path === route,
                'text-gray-400 hover:text-green-600': this.$route.path !== route
            }
        },
        openModal() {
            this.$store.dispatch('showModal');
        }
    }
}
</script>

<style scoped>
</style>