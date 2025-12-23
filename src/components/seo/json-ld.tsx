/**
 * JSON-LD Structured Data for SEO
 * Implements Schema.org WebApplication and Organization schemas
 */

interface JsonLdProps {
    locale: string;
}

export function JsonLdSchema({ locale }: JsonLdProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://youtubeplaylistsummarizer.com";

    const webApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "YouTube Playlist Summarizer",
        "description": "AI-powered tool that summarizes entire YouTube playlists and allows interactive chat with the content. Unlike single video summarizers, process complete playlists instantly.",
        "url": `${baseUrl}/${locale}`,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
        "featureList": [
            "Summarize entire YouTube playlists",
            "AI-powered content analysis",
            "Interactive chat with playlist content",
            "Multi-video transcript processing",
            "Fast and Deep analysis modes",
        ],
        "screenshot": `${baseUrl}/og-image.png`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150",
            "bestRating": "5",
            "worstRating": "1",
        },
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "YouTube Playlist Summarizer",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "sameAs": [],
    };

    const softwareApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "YouTube Playlist Summarizer",
        "applicationCategory": "ProductivityApplication",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150",
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is YouTube Playlist Summarizer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "YouTube Playlist Summarizer is an AI-powered tool that analyzes and summarizes entire YouTube playlists. Unlike other tools that only work with single videos, our tool can process complete playlists and generate comprehensive summaries.",
                },
            },
            {
                "@type": "Question",
                "name": "How does playlist summarization work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply paste your YouTube playlist URL, and our AI will fetch all video transcripts, analyze the content using advanced language models (Gemini), and generate a concise summary. You can then chat with the AI to ask specific questions about the playlist content.",
                },
            },
            {
                "@type": "Question",
                "name": "Is YouTube Playlist Summarizer free to use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, YouTube Playlist Summarizer offers free access to summarize YouTube playlists. Create an account to save your summaries and conversation history.",
                },
            },
            {
                "@type": "Question",
                "name": "What makes this different from single video summarizers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most AI summarizers only work with individual YouTube videos. Our tool is unique because it can process entire playlists at once, understanding the context across multiple videos and providing a unified summary.",
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
