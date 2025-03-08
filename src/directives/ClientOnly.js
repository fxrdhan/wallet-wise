// src/directives/ClientOnly.js
export default {
    mounted(el, binding) {
        // Directive ini akan menampilkan elemen hanya setelah komponen dimount
        // Ini membantu menghindari masalah hydration mismatch
        if (binding.value === false) {
            el.style.display = 'none';
        } else {
            el.style.removeProperty('display');
        }
    }
};