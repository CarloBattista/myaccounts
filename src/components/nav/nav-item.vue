<template>
    <div tabindex="0" class="navItem relative w-fit min-w-[180px] h-[40px] px-[12px] rounded-[16px] flex gap-[8px] items-center text-base font-medium cursor-pointer" :class="{ 'selected-vault': store.selectedVault.data.vaults?.id === data.vaults?.id }">
        <div v-if="hasIcon">
            <slot name="icon"></slot>
        </div>
        <span v-if="label">{{ label }}</span>
    </div>
</template>

<script>
import { store } from '../../data/store';

export default {
    name: "nav-item",
    props: {
        data: Object,
        hasIcon: Boolean,
        label: String
    },
    data() {
        return {
            store
        }
    }
}
</script>

<style scoped>
.navItem {
    padding: 0 12px !important;
    background-color: transparent;
    color: #989898;

    transition-property: background-color, color, transform, opacity;
    transition-duration: 200ms;
    transition-timing-function: ease;
}

.navItem::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: 16px;
    border: 2px solid #fff;
    opacity: 0;
    transition: opacity 100ms ease;
}

.navItem:hover,
.navItem:focus {
    background-color: rgba(255, 255, 255, .1);
    color: #fff;
}

.navItem:active {
    transform: scale(.97);
    opacity: .85;
}

.navItem:focus::before {
    opacity: 1;
}

.navItem.selected-vault {
    background-color: transparent;
    border-bottom: none;
    color: #fff;
}
</style>