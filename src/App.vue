<template>
  <div class="app-container">
    <!-- Peringatan untuk tampilan desktop (≥ 768px) -->
    <DesktopWarning v-if="isDesktop" />
    <!-- Konten aplikasi hanya ditampilkan pada tampilan mobile -->
    <div v-show="!isDesktop" class="container mx-auto p-4 pb-24 bg-gray-50 min-h-screen font-sans">
      <AppHeader />
      <main>
        <router-view />
      </main>
      <AppFooter />
      <AppNavbar />
      <TransactionModal />
    </div>
  </div>
</template>

<script>
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'
import AppNavbar from './components/Navbar.vue'
import TransactionModal from './components/TransactionModal.vue'
import DesktopWarning from './components/DesktopWarning.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppNavbar,
    TransactionModal,
    DesktopWarning
  },
  data() {
    return {
      isDesktop: false,
      screenWidth: window.innerWidth
    }
  },
  mounted() {
    this.$store.dispatch('initializeStore');
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.screenWidth = window.innerWidth;
      this.isDesktop = this.screenWidth >= 7768; // 768px adalah breakpoint untuk md: di Tailwind
    }
  }
}
</script>

<style>
/* App-wide styles */
.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.transition-all {
  transition: all 0.3s ease;
}

/* Navbar styles */
.navbar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0.75rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

.add-button {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Modal styles */
.modal {
  display: none;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s;
}

.modal-content {
  background-color: white;
  margin: 5% auto;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  animation: slideDown 0.3s;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-modal {
  position: absolute;
  right: 20px;
  top: 15px;
}

/* Card padding */
.card-padding {
  padding: 1.25rem !important;
}
</style>