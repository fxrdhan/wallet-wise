<template>
    <div class="desktop-warning">
        <div class="warning-container">
            <div class="warning-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-24 h-24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 class="warning-title">Mobile View Only</h1>
            <p class="warning-text">
                Wallet Wise is designed for mobile devices. Please access this application on a mobile device or reduce
                your browser window size for the best experience.
            </p>
            <div class="phone-mockup">
                <div class="phone-screen"></div>
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
    width: 100%;
    height: 100vh;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.warning-container {
    max-width: 500px;
    text-align: center;
    padding: 2rem;
}

.warning-icon {
    color: #22c55e;
    margin: 0 auto 1.5rem;
    display: flex;
    justify-content: center;
}

.warning-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 1rem;
}

.warning-text {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 2rem;
}

.phone-mockup {
    width: 200px;
    height: 400px;
    background-color: #111827;
    border-radius: 2rem;
    padding: 1rem;
    margin: 0 auto;
    position: relative;
    border: 8px solid #374151;
}

.phone-screen {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    border-radius: 1rem;
}
</style>
