<template>
    <button class="btn-fl rounded-full flex items-center font-medium" :class="'color-'+type, 'size-'+size">
        <div v-if="hasIcon">
            <slot name="icon"></slot>
        </div>
        <span v-if="label">{{ label }}</span>
    </button>
</template>

<script>
export default {
    name: "button-fl",
    props: {
        type: String,
        size: String,
        hasIcon: Boolean,
        label: String
    }
}
</script>

<style scoped>
.btn-fl {
    border: 1px solid transparent;

    transition-property: background-color, color;
    transition-duration: 200ms;
    transition-timing-function: ease;
}

/* Size default */
.btn-fl.size-default{
    font-size: 1rem;
    height: 44px;
    padding: 0 16px;
}

/* Size small */
.btn-fl.size-small{
    font-size: 14px;
    height: 36px;
    padding: 0 12px;
}

/* Primary */
.btn-fl.color-primary {
    background-color: #fff;
    color: #000;
}

.btn-fl.color-primary:hover {
    background-color: #D7D7D7;
    color: rgba(0, 0, 0, .7);
}

/* Secondary */
.btn-fl.color-secondary {
    background-color: #2876FF;
    color: #fff;
}

.btn-fl.color-secondary:hover {
    background-color: #2561CF;
    color: rgba(255, 255, 255, .7);
}

/* Tertiary */
.btn-fl.color-tertiary {
    background-color: #373737;
    color: #fff;
}

.btn-fl.color-tertiary:hover {
    background-color: #4A4A4A;
    color: rgba(255, 255, 255, .7);
}

/* Outline */
.btn-fl.color-outline {
    background-color: transparent;
    border-color: rgba(255, 255, 255, .2);
    color: #fff;
}

.btn-fl.color-outline:hover {
    background-color: rgba(255, 255, 255, .05);
    color: #fff;
}
</style>