import { getLocales } from 'expo-localization';

export const format = () => {
    const local = getLocales();
    console.log(local.languageTag);
    new Intl.NumberFormat()
}