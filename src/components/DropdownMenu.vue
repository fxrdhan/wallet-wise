<!-- src/components/DropdownMenu.vue -->
<template>
    <Menu as="div" class="relative inline-block text-left">
        <div class="flex items-center">
            <MenuButton :class="[
                'inline-flex w-full justify-center gap-x-1.5 rounded-lg px-3 py-2 text-sm font-medium',
                'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 transition-colors',
                buttonClass
            ]">
                <slot name="button-content">Options</slot>
                <i class="fas fa-chevron-down ml-1 text-gray-500"></i>
            </MenuButton>
        </div>
        <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems ref="menuItems"
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none menuItems overflow-hidden">
                <div class="py-1">
                    <slot></slot>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

export default {
    name: 'DropdownMenu',
    components: { Menu, MenuButton, MenuItems },
    props: {
        buttonClass: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped>
/* All screen sizes */
.menuItems {
    transform: translateY(0);
    isolation: isolate;
    overflow: visible !important;
    position: absolute !important; 
    z-index: 1000 !important;
    max-height: 80vh;
    overflow-y: auto;
}

@media (max-width: 640px) {
    :deep(.absolute) {
        z-index: 1000 !important;
        position: fixed !important;
        right: 1rem !important;
        top: auto !important;
        max-width: calc(100vw - 2rem) !important;
    }
}
</style>
