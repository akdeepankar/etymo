'use server';

import { lingoDotDev } from "@/lib/lingo";

/**
 * Translate simple text strings to a target language.
 */
export async function translateText(
    text: string,
    targetLocale: string,
    sourceLocale?: string
) {
    if (!text) return "";
    try {
        const result = await lingoDotDev.localizeText(text, {
            sourceLocale: sourceLocale || null,
            targetLocale,
        });
        return result;
    } catch (error) {
        console.error("Translation error:", error);
        // Return original text or empty string on error? Or throw?
        // Usually translation failure shouldn't crash the app, but returning original text might be confusing if user expects translation.
        // I'll throw for now so the caller knows it failed.
        throw new Error("Failed to translate text");
    }
}

/**
 * Translate nested objects while preserving structure.
 */
export async function translateObject(
    content: Record<string, any>,
    targetLocale: string,
    sourceLocale: string = "en"
) {
    if (!content) return {};
    try {
        const translated = await lingoDotDev.localizeObject(content, {
            sourceLocale,
            targetLocale,
        });
        return translated;
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Failed to translate object");
    }
}

/**
 * Translate chat messages while preserving speaker names.
 */
export async function translateChat(
    conversation: { name: string; text: string }[],
    targetLocale: string,
    sourceLocale?: string
) {
    if (!Array.isArray(conversation) || conversation.length === 0) return [];

    // Sanitize input to ensure valid objects for the SDK
    const cleanConversation = conversation
        .filter(item => item && typeof item === 'object' && item.text)
        .map(item => ({
            name: String(item.name || 'Unknown'),
            text: String(item.text)
        }));

    if (cleanConversation.length === 0) return [];

    try {
        console.log(`Translating chat of ${cleanConversation.length} messages to ${targetLocale}`);

        // Use parallel individual translations to avoid issues with specialized chat endpoints
        const translated = await Promise.all(cleanConversation.map(async (msg) => {
            const translatedText = await translateText(msg.text, targetLocale, sourceLocale);
            return {
                name: msg.name,
                text: translatedText || msg.text
            };
        }));

        return translated;
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Failed to translate chat");
    }
}
