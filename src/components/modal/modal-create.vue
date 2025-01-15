<template>
    <div class="fixed z-[999999] top-0 left-0 w-full pt-[30px] max-h-screen flex items-start justify-center pointer-events-none overflow-y-auto">
        <div class="w-full sm:max-w-[560px] rounded-t-[16px] sm:rounded-[16px] bg-[#1E1E1E] pointer-events-auto">
            <div class="header w-full h-[64px]"></div>
            <div class="body w-full min-h-[100px] px-[32px] py-[24px] ">
                <div class="w-full h-full sm:px-[32px] md:px-[44px] lg:px-[64px]">
                    <div class="w-full mb-[32px] flex flex-col gap-[32px] items-center text-white text-2xl font-semibold">
                        <div class="h-[24px]">
                            <svg class="h-full w-auto" viewBox="0 0 43 25" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.200195 0.399902H6.2002V24.3999H0.200195V0.399902Z" fill="white" />
                                <path d="M12.2002 0.399902H18.2002V24.3999H12.2002V0.399902Z" fill="white" />
                                <path d="M24.2002 0.399902H30.2002V24.3999H24.2002V0.399902Z" fill="white" />
                                <path d="M42.2002 24.3999H36.2002V6.3999L39.2002 9.3999L42.2002 6.3999V24.3999Z"
                                    fill="white" />
                            </svg>
                        </div>
                        <p v-if="title">{{ title }}</p>
                    </div>
                    <slot name="inner"></slot>
                </div>
            </div>
            <div class="footer w-full h-[40px]"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "modal-create",
    props: {
        title: String
    }
}
</script>

<style scoped></style>