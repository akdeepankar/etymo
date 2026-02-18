export type ContentKey = 'title' | 'subtitle' | 'placeholder' | 'collection' | 'signOut';

export const STATIC_CONTENT: Record<ContentKey, string> = {
    title: "Every word has a journey.",
    subtitle: "Trace the origins through time and space.",
    placeholder: "Enter a word (e.g. 'Robot', 'Tea', 'Galaxy')...",
    collection: "My Collection",
    signOut: "Sign Out"
};

export const SIDEBAR_CONTENT = {
    current: "Current",
    evolutionaryPath: "Evolutionary Path",
    saveToCollection: "Save to Collection",
    removeFromCollection: "Remove from Collection",
    expandSidebar: "Expand Sidebar",
    minimizeSidebar: "Minimize Sidebar"
};

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
    { code: 'hi', name: 'Hindi' },
];
