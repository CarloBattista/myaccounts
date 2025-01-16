<template>
    <div>
        <!-- Input per il dominio -->
        <input v-model="domain" type="text" placeholder="Inserisci il dominio" class="bg-white text-black" />

        <!-- Mostra il logo se disponibile -->
        <div v-if="logoUrl">
            <img :src="logoUrl" :alt="`Logo di ${domain}`" @error="handleError" />
        </div>
        <!-- Mostra un messaggio se il logo non è disponibile -->
        <p v-else>Logo non disponibile</p>
    </div>
</template>

<script>
export default {
    name: "Test",
    data() {
        return {
            logoUrl: null, // URL del logo
            domain: "",    // Nome del dominio
            apiKey: "pk_WBaAgIr4Tv6-oAJONxYtbg", // Inserisci qui la tua API key
        };
    },
    watch: {
        domain: {
            async handler(newDomain) {
                if (newDomain) {
                    try {
                        // Costruzione dell'URL
                        const apiUrl = `https://img.logo.dev/${newDomain}?token=${this.apiKey}&retina=true`;
                        console.log("Chiamata API:", apiUrl);

                        // Richiesta con header Authorization
                        const response = await fetch(apiUrl, {
                            headers: {
                                Authorization: `Bearer ${this.apiKey}`, // Header con API key
                            },
                        });

                        if (response.ok) {
                            const logoBlob = await response.blob(); // Converte la risposta in Blob
                            this.logoUrl = URL.createObjectURL(logoBlob);
                            console.log("Logo ottenuto:", this.logoUrl);
                        } else {
                            console.warn("Errore durante il recupero del logo:", response.statusText);
                            this.logoUrl = null;
                        }
                    } catch (error) {
                        console.error("Errore nella richiesta:", error);
                        this.logoUrl = null;
                    }
                } else {
                    this.logoUrl = null; // Resetta il logo se il dominio è vuoto
                }
            },
            immediate: true, // Applica subito l'handler
        },
    },
    methods: {
        handleError() {
            console.warn("Immagine non trovata o non caricabile");
            this.logoUrl = null; // Rimuove il logo se l'immagine non è disponibile
        },
    },
};
</script>

<style>
img {
    max-width: 150px;
    height: auto;
}
</style>