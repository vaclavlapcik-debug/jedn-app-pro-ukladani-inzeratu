/**
 * Extracts YouTube Video ID from various URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;

    // Handle search links separately if needed, but here we want Video ID
    if (url.includes('/results?')) return null;

    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Generates YouTube thumbnail URL.
 * Tries maxresdefault first, but we can't check existence easily on client without fetch.
 * Standard fallback is hqdefault if maxres doesn't exist, but visually here we return maxres.
 */
export const getYoutubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Validates if string is a YouTube URL
 */
export const isYoutubeUrl = (url: string): boolean => {
    return !!extractYoutubeId(url);
};
