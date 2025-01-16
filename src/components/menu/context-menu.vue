<template>
    <div ref="contextMenu" class="contextMenu-container absolute z-[9999] min-w-[180px] rounded-[20px]">
        <div class="w-full p-[8px] flex flex-col">
            <slot name="inner"></slot>
        </div>
    </div>
</template>

<script>
import { store } from '../../data/store';

export default {
    name: "context-menu",
    data() {
        return {
            store
        }
    },
    methods: {
        closeContextMenu(event) {
            const contextMenu = this.$refs.contextMenu;
            if (!contextMenu || !contextMenu.contains(event.target)) {
                this.store.contextMenu.open = false;
                this.store.contextMenu.x = 0;
                this.store.contextMenu.y = 0;
                this.store.contextMenu.data = null;
            }
        },
    },
    mounted() {
        document.addEventListener("click", this.closeContextMenu);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.closeContextMenu);
    },
}
</script>

<style scoped>
.contextMenu-container {
    background-color: rgba(38, 38, 38, .9);
    backdrop-filter: blur(24px);
}
</style>