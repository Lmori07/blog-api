/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
 * Generate a random username (e.g., user-abc123)
 * @returns Random generated username
 * */
export const generateUsername = () => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);
    const username = usernamePrefix + randomChars;
    return username;
}