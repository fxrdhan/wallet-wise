<template>
    <div>
        <div class="bg-white rounded-xl shadow-md p-6 card-hover transition-all relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 relative z-10">
                <h2 class="text-xl font-semibold text-gray-800">Statistik Keuangan</h2>
                <div class="flex space-x-2">
                    <select class="bg-gray-100 border-0 text-gray-700 py-1 px-3 rounded-lg text-sm">
                        <option>Bulan Ini</option>
                        <option>3 Bulan Terakhir</option>
                        <option>6 Bulan Terakhir</option>
                        <option>Tahun Ini</option>
                    </select>
                </div>
            </div>

            <div class="text-center p-12 text-gray-500">
                <i class="fas fa-chart-pie text-5xl mb-4 text-gray-300"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Fitur Statistik Segera Hadir</h3>
                <p>Kami sedang mengembangkan fitur statistik untuk membantu Anda memahami pola pengeluaran dan
                    pemasukan.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatisticsView'
}
</script>