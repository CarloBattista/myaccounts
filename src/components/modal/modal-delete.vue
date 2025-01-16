<template>
    <div class="fixed z-[999999] top-0 left-0 w-full pt-[30px] min-h-screen max-h-screen flex items-end sm:items-center justify-center pointer-events-none overflow-y-auto">
        <div class="w-full sm:max-w-[400px] rounded-t-[16px] sm:rounded-[16px] bg-[#1E1E1E] pointer-events-auto">
            <div class="header w-full h-[64px] px-[16px] grid gap-[16px] items-center grid-cols-[minmax(36px,1fr)_auto_minmax(36px,1fr)]">
                <div class="flex items-center justify-start"></div>
                <div class="flex items-center justify-center text-center text-white text-xl font-medium">
                    <h2 v-if="head">{{ head }}</h2>
                </div>
                <div class="flex items-center justify-end">
                    <div @click="closeModal" class="group relative h-[36px] aspect-square p-[4px] cursor-pointer">
                        <div class="w-full h-full rounded-full flex items-center justify-center text-[#989898] bg-[#2E2E2E] group-hover:bg-[#3D3D3D] transition-colors duration-150">
                            <X size="16" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="body w-full p-[24px] pt-[8px] text-[#989898] text-sm font-normal text-center">
                <p v-if="paragraph">{{ paragraph }}</p>
            </div>
            <div class="footer w-full px-[16px] py-[12px]">
                <div class="w-full grid grid-cols-2 gap-[12px] items-center">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// ICONS
import { X } from 'lucide-vue-next';

export default {
    name: "modal-delete",
    components: {
        // ICONS
        X
    },
    props: {
        head: String,
        paragraph: String
    }
}
</script>

<style scoped></style>