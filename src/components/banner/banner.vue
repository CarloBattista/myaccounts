<template>
    <div class="w-full min-h-[60px] p-[12px] rounded-[12px] flex gap-[8px] items-center justify-between text-sm font-medium text-white bg-[#2E2E2E]">
        <div class="px-[4px] flex gap-[12px] items-center justify-start">
            <div v-if="hasIcon" class="relative h-[20px] aspect-square flex items-center justify-center">
                <slot name="icon"></slot>
            </div>
            <p v-if="message">{{ message }}</p>
        </div>
        <div class="flex gap-[12px] items-center justify-end">
            <slot v-if="hasActions" name="actions"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "banner",
    props: {
        hasIcon: Boolean,
        hasActions: Boolean,
        message: String
    }
}
</script>

<style scoped></style>