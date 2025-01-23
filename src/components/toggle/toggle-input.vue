<template>
    <div class="relative w-fit p-[4px] rounded-full flex gap-[2px] items-center bg-[#2E2E2E] cursor-pointer overflow-hidden"
        :class="{ 'h-[44px]': size === 'default', 'h-[36px]': size === 'small' }">
        <slot name="options"></slot>
        <div class="absolute z-[1] top-0 left-0 w-full h-full p-[4px] pointer-events-none">
            <div class="selector relative rounded-full bg-[#111] transition-[width,transform] duration-200"
                :style="{ width: selector.width + 'px', height: selector.height + 'px', transform: getTranslateX() }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "toggle-input",
    props: {
        size: String,
        selector: Object
    },
    methods: {
        getTranslateX() {
            if (this.selector.selected === 'one') {
                return 'translateX(0)';
            } else if (this.selector.selected === 'two') {
                return 'translateX(calc(100% - 4px))';
            } else if (this.selector.selected === 'three') {
                return 'translateX(calc(200% - 1px))';
            } else {
                return 'translateX(0)';
            }
        }
    }
}
</script>

<style scoped></style>