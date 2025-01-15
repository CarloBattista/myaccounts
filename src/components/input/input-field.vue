<template>
    <div class="relative">
        <label :for="forInput" class="flex flex-col gap-[8px]">
            <span v-if="label" class="text-[#989898] text-sm font-medium">{{ label }}</span>
            <input :type="type" :placeholder="placeholder" :id="forInput" class="h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium placeholder:text-[#989898] text-white bg-[#2E2E2E] focus:outline-white focus:bg-[#1E1E1E]">
            <p v-if="error" class="w-full px-[4px] text-[#F34822] text-xs font-normal">{{ error }}</p>
        </label>
    </div>
</template>

<script>
export default {
    name: "input-field",
    props: {
        type: String,
        forInput: String,
        label: String,
        placeholder: String,
        required: Boolean,
        error: String
    }
}
</script>

<style scoped></style>