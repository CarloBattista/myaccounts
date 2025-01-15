<template>
    <div class="card-account-container w-full max-w-[670px] rounded-[20px] p-[12px] flex items-center justify-between cursor-pointer" :class="'card-account-'+index, { 'loading': loading }">
        <div class="flex gap-[10px] items-center justify-start">
            <div class="relative h-[64px] rounded-[16px] aspect-square overflow-hidden" :class="{ 'loading-skeleton': loading }">
                <img v-if="!loading && data.accounts?.account_image" :src="loading ? '' : data.accounts?.account_image" :alt="loading ? '' : data.accounts?.name" loading="lazy" draggable="false" class="w-full h-full object-cover">
                <div class="absolute top-0 left-0 w-full h-full rounded-[16px] border border-solid border-white/10"></div>
            </div>
            <div class="flex flex-col gap-[2px]">
                <h2 class="text-white text-base font-medium" :class="{ 'loading-skeleton w-[50vw] min-w-[130px] max-w-[230px] h-[24px]': loading }">{{ loading ? "" : data.accounts?.name }}</h2>
                <p class="text-[#989898] text-xs font-normal" :class="{ 'loading-skeleton w-[35vw] min-w-[70px] max-w-[150px] h-[16px]': loading }">{{ loading ? "" : data.accounts?.email }}</p>
            </div>
        </div>
        <div class="flex items-center justify-end"></div>
    </div>
</template>

<script>
export default {
    name: "card-account",
    props: {
        loading: Boolean,
        data: Object,
        index: Number
    }
}
</script>

<style scoped>
.card-account-container {
    background-color: transparent;

    transition-property: background-color, color;
    transition-duration: 200ms;
    transition-timing-function: ease;
}

.card-account-container.loading {
    pointer-events: none;
    cursor: default;
}

.card-account-container:not(.loading):hover{
    background-color: #373737;
}

.loading-skeleton {
    background-color: #181818;
    animation: skeletonLoading 4s ease 0s infinite;
}

.card-account-container.card-account-0 .loading-skeleton { animation-delay: 0s; }
.card-account-container.card-account-1 .loading-skeleton { animation-delay: .2s; }
.card-account-container.card-account-2 .loading-skeleton { animation-delay: .4s; }
.card-account-container.card-account-3 .loading-skeleton { animation-delay: .6s; }
.card-account-container.card-account-4 .loading-skeleton { animation-delay: .8s; }
.card-account-container.card-account-5 .loading-skeleton { animation-delay: 1s; }
.card-account-container.card-account-6 .loading-skeleton { animation-delay: 1.2s; }
.card-account-container.card-account-7 .loading-skeleton { animation-delay: 1.4s; }

@keyframes skeletonLoading {
    0% {
        background-color: #181818;
    }
    25% {
        background-color: #181818;
    }
    50% {
        background-color: #212121;
    }
    100% {
        background-color: #181818;
    }
}
</style>