<template>
    <div class="spinner relative h-[20px] aspect-square">
        <div class="spinner-line" :class="'spinner-line-' + spinnderLineIndex"
            v-for="(spinnderLine, spinnderLineIndex) in 8" :key="spinnderLineIndex"></div>
    </div>
</template>

<script>
export default {
    name: "loader"
}
</script>

<style scoped>
.spinner-line {
    position: absolute;
    top: 6.5px;
    left: 8.5px;
    width: 2.5px;
    height: 6.5px;
    border-radius: 1.25px;
    background-color: #8e8e93;
    animation: spinnerLine 1s linear infinite;
    will-change: opacity;
}

.spinner-line:nth-child(1) {
    transform: rotate(45deg) translateY(-6.5px);
    animation-delay: -1.625s;
}

.spinner-line:nth-child(2) {
    transform: rotate(90deg) translateY(-6.5px);
    animation-delay: -1.5s;
}

.spinner-line:nth-child(3) {
    transform: rotate(135deg) translateY(-6.5px);
    animation-delay: -1.375s;
}

.spinner-line:nth-child(4) {
    transform: rotate(180deg) translateY(-6.5px);
    animation-delay: -1.25s;
}

.spinner-line:nth-child(5) {
    transform: rotate(225deg) translateY(-6.5px);
    animation-delay: -1.125s;
}

.spinner-line:nth-child(6) {
    transform: rotate(270deg) translateY(-6.5px);
    animation-delay: -1s;
}

.spinner-line:nth-child(7) {
    transform: rotate(315deg) translateY(-6.5px);
    animation-delay: -0.875s;
}

.spinner-line:nth-child(8) {
    transform: rotate(360deg) translateY(-6.5px);
    animation-delay: -0.75s;
}

@keyframes spinnerLine {
    0% {
        opacity: 0.85;
    }

    50% {
        opacity: 0.25;
    }

    100% {
        opacity: 0.25;
    }
}
</style>