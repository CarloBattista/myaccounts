<template>
    <div class="relative">
        <label :for="forInput" class="flex flex-col gap-[8px]">
            <span v-if="label" class="text-[#989898] text-sm font-medium" :class="{ 'text-[#F34822]': error }">{{ label }}</span>
            <input v-model="internalValue" :type="type" :placeholder="placeholder" :id="forInput" class="h-[48px] px-[16px] py-[12px] rounded-[16px] outline outline-2 outline-transparent text-base font-medium" :class="{ 'placeholder:text-[#989898] text-white bg-[#2E2E2E] focus:bg-[#1E1E1E] focus:outline-white': !error, 'text-[#F34822] bg-[#F34822]/20 focus:outline-[#F34822]': error }">
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
        error: String,
        modelValue: String
    },
    emits: ['update:modelValue'],
    computed: {
        internalValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    }
}
</script>

<style scoped></style>