<!-- src/components/DesktopWarning.vue -->
<template>
    <div class="desktop-warning">
        <div class="warning-container">
            <div class="warning-icon">
                <i class="fas fa-mobile-alt text-6xl mb-4"></i>
            </div>
            <h2 class="warning-title">Aplikasi Mobile Only</h2>
            <p class="warning-text">
                Wallet Wise dirancang khusus untuk pengalaman optimal di perangkat mobile.
                Silakan buka aplikasi ini di smartphone atau tablet Anda, atau ubah ukuran jendela browser Anda ke
                ukuran mobile.
            </p>
            <div class="qr-code-container">
                <div class="qr-code-placeholder">
                    <i class="fas fa-qrcode text-5xl"></i>
                </div>
                <p class="qr-text">Scan QR code untuk membuka di perangkat mobile Anda</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DesktopWarning'
}
</script>

<style scoped>
.desktop-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.warning-container {
    max-width: 500px;
    text-align: center;
    background-color: #f9fafb;
    padding: 3rem 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.warning-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
}

.warning-text {
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.qr-code-container {
    margin-top: 2rem;
}

.qr-code-placeholder {
    width: 120px;
    height: 120px;
    background-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    border-radius: 0.5rem;
    color: #9ca3af;
}

.qr-text {
    font-size: 0.875rem;
    color: #6b7280;
}
</style>