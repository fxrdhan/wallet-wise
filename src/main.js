import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ClientOnly from './directives/ClientOnly'

// Migrate any existing 'debit' assets to 'credit'
function migrateExistingAssets() {
    const assets = JSON.parse(localStorage.getItem('assets')) || [];
    const hasDebit = assets.some(asset => asset.type === 'debit');
    
    if (hasDebit) {
        const updatedAssets = assets.map(asset => 
            asset.type === 'debit' ? {...asset, type: 'credit', name: 'Kredit'} : asset
        );
        localStorage.setItem('assets', JSON.stringify(updatedAssets));
    }
}

migrateExistingAssets();

const app = createApp(App)

// Register custom directive
app.directive('client-only', ClientOnly)

app.use(store)
app.use(router)
app.mount('#app')