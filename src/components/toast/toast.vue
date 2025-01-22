<template>
    <div class="fixed bottom-[24px] left-0 w-full flex items-center justify-center">
        <div class="max-w-[670px] mx-auto group">
            <div @mouseover="enter = true" @mouseleave="enter = false"
                class="relative w-fit h-[60px] p-[8px] rounded-full flex gap-[12px] items-center bg-white text-black text-base font-medium transition duration-300 ease-in-out pointer-events-none">
                <div v-if="store.toast.hasIcon"
                    class="h-[44px] aspect-square rounded-full flex items-center justify-center border border-solid border-black/20">
                    <slot name="icon"></slot>
                </div>
                <p v-if="store.toast.message" class="text-balance mr-[24px]">{{ store.toast.message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '../../data/store';

export default {
    name: "toast",
    data() {
        return {
            store,

            enter: false
        }
    },
    watch: {
        'store.toast.open': {
            handler(value) {
                const exit = 3000;

                if (value) {
                    setTimeout(() => {
                        this.store.toast.open = false;
                    }, exit)
                }
            },
            immediate: true,
            deep: true
        },
    }
}
</script>

<style></style>