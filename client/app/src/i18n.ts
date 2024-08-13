import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttApi from 'i18next-http-backend';

/* Configures and initializes i18next for handling translations with backend loading and multiple namespaces */
i18n.use(HttApi)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        ns: ['appbar', 'demandview', 'marketview', 'offernegotiationsview', 'passwordReset', 'procnegotiationsview', 'profileview', 'signin', 'signup', 'supplyview', 'crop', 'numbers', 'names'],
        backend: {
            loadPath: '/i18n/{{lng}}/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false
        }
    })

export default i18n;