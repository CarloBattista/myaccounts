<template>
    <div class="relative w-full h-full overflow-hidden">
        <div class="relative flex gap-[16px] rotate-[45deg] translate-x-[70%] translate-y-[-24%] origin-top-left">
            <div v-for="(row, rowIndex) in shuffledRows" :key="rowIndex" class="row flex flex-col gap-[16px]"
                :class="'row-' + rowIndex">
                <div v-for="(company, companyIndex) in row" :key="companyIndex"
                    class="h-[96px] aspect-square rounded-[16px] overflow-hidden">
                    <img :src="`${path_image}${company.company_name}.png`" :alt="company.company_name" draggable="false"
                        loading="lazy" class="h-full w-full object-cover">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "background-logos",
    data() {
        return {
            path_image: "/_resources/company_logos/png/",
            logos: [
                { company_name: "airbnb" },
                { company_name: "chatgpt" },
                { company_name: "coinbase" },
                { company_name: "disney_plus" },
                { company_name: "duolingo" },
                { company_name: "facebook" },
                { company_name: "figma" },
                { company_name: "flighty" },
                { company_name: "github" },
                { company_name: "glovo" },
                { company_name: "instagram" },
                { company_name: "linkedin" },
                { company_name: "masterclass" },
                { company_name: "netflix" },
                { company_name: "notion" },
                { company_name: "patreon" },
                { company_name: "paypal" },
                { company_name: "prime_video" },
                { company_name: "revolut" },
                { company_name: "skill_share" },
                { company_name: "slack" },
                { company_name: "snapchat" },
                { company_name: "spotify" },
                { company_name: "threads" },
                { company_name: "tiktok" },
                { company_name: "uber_eats" },
                { company_name: "uber" },
                { company_name: "youtube" }
            ],
            shuffledRows: []
        }
    },
    methods: {
        generateShuffledRows() {
            const rows = 10; // Numero di righe
            const logosCopy = [...this.logos]; // Copia dell'array dei loghi
            const shuffled = [];

            for (let i = 0; i < rows; i++) {
                // Mescola casualmente i loghi per ogni riga
                const row = logosCopy
                    .map((logo) => ({ ...logo, sort: Math.random() })) // Aggiungi un valore casuale
                    .sort((a, b) => a.sort - b.sort) // Ordina casualmente
                    .map(({ company_name }) => ({ company_name })) // Rimuovi la chiave "sort"
                    .slice(0, 20); // Seleziona un sottoinsieme di loghi (10 per riga)
                shuffled.push(row);
            }

            this.shuffledRows = shuffled;
        }
    },
    created() {
        this.generateShuffledRows();
    },
}
</script>

<style scoped>
.row {
    animation: firstRow 200s ease 0s infinite;
}

.row.row-0 {
    animation-duration: 200s;
}

.row.row-1 {
    animation-duration: 240s;
}

.row.row-2 {
    animation-duration: 220s;
}

.row.row-3 {
    animation-duration: 270s;
}

.row.row-4 {
    animation-duration: 190s;
}

.row.row-5 {
    animation-duration: 230s;
}

.row.row-6 {
    animation-duration: 180s;
}

.row.row-7 {
    animation-duration: 250s;
}

.row.row-8 {
    animation-duration: 290s;
}

.row.row-9 {
    animation-duration: 280s;
}

.row.row-10 {
    animation-duration: 235s;
}

@keyframes firstRow {
    0% {
        transform: translateY(15%);
    }

    50% {
        transform: translateY(-55%);
    }

    100% {
        transform: translateY(20%);
    }
}
</style>