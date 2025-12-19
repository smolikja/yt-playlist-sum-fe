import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en"], // TODO: add "cs" when ready
    // Used when no locale matches
    defaultLocale: "en",
    // Automatically detect user's preferred locale
    localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
