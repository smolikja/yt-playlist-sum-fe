import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { JsonLdSchema } from "@/components/seo/json-ld";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://youtubeplaylistsummarizer.com";

    return {
        title: {
            default: messages.metadata.title,
            template: messages.metadata.titleTemplate || "%s | YouTube Playlist Summarizer",
        },
        description: messages.metadata.description,
        keywords: messages.metadata.keywords?.split(", ") || [
            "YouTube playlist summarizer",
            "AI video summary",
            "summarize YouTube playlist",
            "playlist to text",
            "YouTube AI summary",
            "video transcript summary",
            "bulk video summarizer",
        ],
        authors: [{ name: messages.metadata.author || "YouTube Playlist Summarizer" }],
        creator: "YouTube Playlist Summarizer",
        publisher: "YouTube Playlist Summarizer",
        applicationName: messages.metadata.applicationName || "YouTube Playlist Summarizer",

        // Canonical and alternates for i18n
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/${locale}`,
            languages: {
                "en": "/en",
                "cs": "/cs",
            },
        },

        // Open Graph
        openGraph: {
            title: messages.metadata.ogTitle,
            description: messages.metadata.ogDescription,
            url: `${baseUrl}/${locale}`,
            siteName: "YouTube Playlist Summarizer",
            locale: locale === "cs" ? "cs_CZ" : "en_US",
            type: "website",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "YouTube Playlist Summarizer - AI-Powered Summaries",
                },
            ],
        },

        // Twitter Card
        twitter: {
            card: "summary_large_image",
            title: messages.metadata.ogTitle,
            description: messages.metadata.ogDescription,
            images: ["/og-image.png"],
        },

        // Robots
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        // Icons
        icons: {
            icon: "/favicon.ico",
            apple: "/apple-touch-icon.png",
        },

        // Verification (add your tokens when ready)
        // verification: {
        //     google: "your-google-verification-code",
        // },

        // Category
        category: "Technology",
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the current locale
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <JsonLdSchema locale={locale} />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <QueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
