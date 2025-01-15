<template>
    <div class="relative">
        <div class="avatar-dot relative aspect-square rounded-full flex items-center justify-center bg-[#2E2E2E] text-white"
            :class="'avatar-' + size, { 'cursor-pointer': hasInputFile || hasProfileMenu }">
            <span class="name-initial w-full flex items-center justify-center text-center font-semibold">C</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "avatar",
    props: {
        size: String,
        hasInputFile: Boolean,
        hasProfileMenu: Boolean
    },
    data() {
        return {
            profileMenuIsOpen: false
        }
    }
}
</script>

<style scoped>
.avatar-dot.avatar-small {
    font-size: 1rem;
    /* 16px */
    line-height: 1.5rem;
    /* 24px */
    height: 36px;
}

.avatar-dot.avatar-large {
    font-size: 1.125rem;
    /* 18px */
    line-height: 1.75rem;
    /* 28px */
    height: 72px;
}

.avatar-dot.avatar-extra-large {
    font-size: 1.5rem;
    /* 24px */
    line-height: 2rem;
    /* 32px */
    height: 96px;
}

.avatar-dot.avatar-big {
    font-size: 1.875rem;
    /* 30px */
    line-height: 2.25rem;
    /* 36px */
    height: 120px;
}
</style>