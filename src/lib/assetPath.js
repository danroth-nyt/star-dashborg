/**
 * Returns the correct path for assets in the public folder.
 * Automatically handles base path differences between localhost and deployed environments (e.g., GitHub Pages).
 * 
 * @param {string} path - The asset path relative to the public folder (e.g., 'images/boost/icon_01.png')
 * @returns {string} The full path including the base URL
 */
export function getAssetPath(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
