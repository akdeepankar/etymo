import { LingoDotDevEngine } from "lingo.dev/sdk";

const apiKey = process.env.LINGODOTDEV_API_KEY;

if (!apiKey) {
    console.warn("Warning: LINGODOTDEV_API_KEY is not defined in environment variables.");
}

export const lingoDotDev = new LingoDotDevEngine({
    apiKey: apiKey || "",
});
