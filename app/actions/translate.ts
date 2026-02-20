'use server';

import { lingoDotDev, isLingoEnabled } from "@/lib/lingo";

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
        if (!isLingoEnabled) {
            return text;
        }

        const result = await lingoDotDev.localizeText(text, {
            sourceLocale: sourceLocale || null,
            targetLocale,
            fast: true
        });
        return result || text;
    } catch (error) {
        console.error("Action error in translateText:", error);
        return text;
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
        if (!isLingoEnabled) {
            return content;
        }

        const translated = await lingoDotDev.localizeObject(content, {
            sourceLocale,
            targetLocale,
        });

        // Ensure result is a plain serializable object
        return JSON.parse(JSON.stringify(translated));
    } catch (error) {
        console.error("Action error in translateObject:", error);
        return content;
    }
}

/**
 * Translate chat messages while preserving speaker names.
 */
export async function translateChat(
    conversation: { name: string; text: string }[],
    targetLocale: string,
    sourceLocale: string = "en"
) {
    if (!Array.isArray(conversation) || conversation.length === 0) return [];

    try {
        if (!isLingoEnabled) {
            return conversation;
        }

        // Extract texts to translate
        const textsToTranslate = conversation
            .filter(item => item && item.text)
            .map(item => String(item.text));

        if (textsToTranslate.length === 0) return conversation;

        // Use the specialized localizeStringArray method
        const translatedTexts = await lingoDotDev.localizeStringArray(textsToTranslate, {
            sourceLocale,
            targetLocale,
            fast: true
        });

        // Map back to conversation structure
        let tIdx = 0;
        const translatedConversation = conversation.map(msg => {
            if (msg && msg.text) {
                return {
                    name: msg.name,
                    text: translatedTexts[tIdx++] || msg.text
                };
            }
            return msg;
        });

        return JSON.parse(JSON.stringify(translatedConversation));
    } catch (error) {
        console.error("Action error in translateChat:", error);
        return conversation;
    }
}
