import { createI18n } from 'vue-i18n';

const loadLocaleMessages = () => {
    const messages = {};

    const locales = import.meta.glob("../lang/*.json", { eager: true });

    // Aggiungi i file JSON al messaggio
    for (const [key, value] of Object.entries(locales)) {
        const lang = key.split('/').pop().split('.')[0];
        messages[lang] = value.default;
    }

    return messages;
};

const savedLocale = localStorage.getItem("locale") || "en";

const i18n = createI18n({
    legacy: false,  // Supporto per Composition API
    locale: savedLocale,  // Lingua predefinita
    fallbackLocale: "en",  // Lingua di fallback
    messages: loadLocaleMessages(),  // Carica le traduzioni
});

export default i18n;
