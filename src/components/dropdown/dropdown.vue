<template>
    <div ref="dropdown" class="relative">
        <div class="relative flex flex-col gap-[8px]">
            <span v-if="label" class="text-[#989898] text-sm font-medium" :class="{ 'text-[#F34822]': error }">{{ label }}</span>
            <div @click="dropdownMenuIsVisible = !dropdownMenuIsVisible" tabindex="0"
                class="h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium cursor-pointer" :class="{ 'text-[#989898] bg-[#2E2E2E] focus:bg-[#1E1E1E] focus:outline-white': !error, 'text-[#F34822] bg-[#F34822]/20 focus:outline-[#F34822]': error }">
                <span>{{ selected }}</span>
            </div>
            <p v-if="error" class="w-full px-[4px] text-[#F34822] text-xs font-normal">{{ error }}</p>
        </div>
        <Transition name="dropdown-fade">
            <div v-if="dropdownMenuIsVisible"
                class="dropdownOption-container absolute z-[10] top-full left-0 w-full rounded-[16px] translate-y-[12px] shadow-lg">
                <div class="w-full h-full p-[8px] flex flex-col">
                    <slot name="inner"></slot>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    name: "dropdown",
    props: {
        label: String,
        selected: String,
        error: String
    },
    data() {
        return {
            dropdownMenuIsVisible: false,
        }
    },
    methods: {
        handleClickOutside(event) {
            const dropdownMenu = this.$refs.dropdown;

            if (this.dropdownMenuIsVisible && dropdownMenu && !dropdownMenu.contains(event.target)) {
                this.dropdownMenuIsVisible = false;
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeMount() {
        document.removeEventListener("click", this.handleClickOutside);
    }
}
</script>

<style scoped>
.dropdownOption-container {
    background-color: rgba(38, 38, 38, .9);
    backdrop-filter: blur(24px);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition-property: transform, opacity;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    transform: translateY(0);
    opacity: 0;
}
</style>