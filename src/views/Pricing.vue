<template>
    <navbar :inHeroPlatform="false" />
    <div role="main" class="main-container mt-[32px]">
        <div class="w-full px-[20px] lg:px-[32px] min-h-screen">
            <div
                class="w-full h-fit text-[#989898] text-xl font-normal flex flex-col gap-[24px] mb-[24px] justify-center text-center text-balance">
                <div class="text-white text-5xl lg:text-7xl font-semibold">
                    <h2>More features.</h2>
                </div>
                <p>Get full access to all apps & features from only $0.33 per day — Cancel anytime.</p>
            </div>
            <div class="w-full mb-[40px] flex flex-col gap-[16px] items-center">
                <div
                    class="relative w-fit h-[44px] p-[4px] rounded-full flex gap-[2px] items-center bg-[#2E2E2E] cursor-pointer">
                    <button @click="cycle_selected = 'Yearly'" type="button"
                        class="h-full px-[16px] rounded-full flex items-center justify-center text-base font-medium transition-colors duration-150 cursor-pointer"
                        :class="{ 'text-white bg-[#111]': cycle_selected === 'Yearly', 'text-white/40 hover:text-white/60 hover:bg-[#111]/40': cycle_selected !== 'Yearly' }">Yearly</button>
                    <button @click="cycle_selected = 'Quarterly'" type="button"
                        class="h-full px-[16px] rounded-full flex items-center justify-center text-base font-medium transition-colors duration-150 cursor-pointer"
                        :class="{ 'text-white bg-[#111]': cycle_selected === 'Quarterly', 'text-white/40 hover:text-white/60 hover:bg-[#111]/40': cycle_selected !== 'Quarterly' }">Quarterly</button>
                </div>
                <p class="w-full text-base font-normal text-center"><strong class="text-[#2876FF]">Save 33%</strong> on
                    a yearly subscription</p>
            </div>
            <div class="max-w-[792px] mb-[40px] mx-auto">
                <div class="w-full flex flex-col md:flex-row gap-[24px] items-start justify-between">
                    <div v-for="(plan, planIndex) in plans" :key="planIndex"
                        class="w-full p-[24px] rounded-[24px] flex flex-col gap-[16px] border border-solid"
                        :class="{ 'bg-[#1E1E1E] border-transparent': plan.name === 'Pro', 'bg-[#111] border-white/20': plan.name === 'Team' }">
                        <div class="w-full flex-col gap-[4px]">
                            <div class="flex gap-[8px] items-center">
                                <h2 class="text-white text-2xl font-semibold">{{ plan.name }}</h2>
                                <span v-if="plan.name === 'Pro'"
                                    class="relative h-[24px] py-[4px] px-[8px] rounded-[8px] bg-[#2876FF] text-white text-xs font-semibold flex items-center justify-center">Popular</span>
                            </div>
                            <p class="text-[#989898] text-base font-normal">{{ plan.descriptions }}</p>
                        </div>
                        <div class="w-full flex gap-[8px] items-center">
                            <h2 class="text-white text-5xl font-bold">${{ plan.price }}</h2>
                            <div class="flex flex-col text-xs font-normal">
                                <p>per month</p>
                                <p>billed quarterly</p>
                            </div>
                        </div>
                        <buttonFl @click="handlePlan(plan)" :type="plan.name === 'Pro' ? 'primary' : 'outline'"
                            size="default" :hasIcon="false" :label="plan.name === 'Pro' ? 'Upgrade' : 'Create Team'" />
                        <ul class="w-full flex flex-col">
                            <li v-for="(feature, featureIndex) in plan.features" :key="featureIndex"
                                class="w-full py-[4px] flex gap-[8px] items-center text-[#989898] text-base font-normal">
                                <RectangleEllipsis v-if="feature.icon === 'password-generator'" />
                                <LifeBuoy v-if="feature.icon === 'assistance'" />
                                <Vault v-if="feature.icon === 'infinite-vault'" />
                                <span>{{ feature.label }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';

import navbar from '../components/nav/navbar.vue';
import buttonFl from '../components/button/button-fl.vue';

// ICONS
import { RectangleEllipsis, LifeBuoy, Vault } from 'lucide-vue-next'

export default {
    name: "Pricing",
    components: {
        navbar,
        buttonFl,

        // ICONS
        RectangleEllipsis,
        LifeBuoy,
        Vault
    },
    data() {
        return {
            store,
            auth,

            cycle_selected: "Yearly",
            plans: [
                {
                    id: 0,
                    priceId: "price_1QkATHKMufpj7BQSxyPWzHgN",
                    name: "Pro",
                    descriptions: "For individuals",
                    price: "15",
                    features: [
                        {
                            icon: "password-generator",
                            label: "Generatore di password"
                        },
                        {
                            icon: "assistance",
                            label: "Assistenza 24/7 prioritaria"
                        },
                        {
                            icon: "infinite-vault",
                            label: "Cassaforti infinite"
                        }
                    ]
                },
                {
                    id: 1,
                    name: "Team",
                    descriptions: "For teams & agencies",
                    price: "18",
                    features: [
                        {
                            icon: "password-generator",
                            label: "Generatore di password"
                        },
                        {
                            icon: "assistance",
                            label: "Assistenza 24/7 prioritaria"
                        },
                        {
                            icon: "infinite-vault",
                            label: "Cassaforti infinite"
                        }
                    ]
                }
            ],
            stripe: null,
        }
    },
    methods: {
        async handleSubscribe() {
            const priceId = "price_1QkATHKMufpj7BQSxyPWzHgN";

            try {
                if (!this.stripe) {
                    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
                }

                const sid = uuidv4();

                const result = await this.stripe.redirectToCheckout({
                    lineItems: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],
                    mode: "subscription",
                    successUrl: `${window.location.origin}/confirm?success=true&session_id=${sid}`,
                    cancelUrl: `${window.location.origin}/confirm?success=false`,
                    billingAddressCollection: "required",
                    locale: "it",
                });

                if (result.error) {
                    console.error("Stripe Checkout Error:", result.error.message);
                }
            } catch (error) {
                console.error("Stripe Initialization Error:", error.message);
            }
        },

        handlePlan(plan) {
            const PRO = plan.name === 'Pro';
            const TEAM = plan.name === 'Team';

            if (!plan) {
                return false;
            }

            if (!this.auth.isAuthenticated) {
                return this.$router.push({ name: 'identity-login' });
            } else {
                if (PRO) {
                    this.handleSubscribe();
                }

                if (TEAM) {
                    return false;
                }
            }
        }
    }
}
</script>

<style scoped></style>