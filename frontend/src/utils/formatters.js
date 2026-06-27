/**
 * Format a number as Indonesian Rupiah.
 * @param {number} num
 * @returns {string}  e.g. "Rp 8.500"
 */
export const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

/**
 * Format an ISO date string to locale Indonesian date.
 * @param {string} dateStr
 * @returns {string}  e.g. "15 Januari 2024"
 */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Truncate a string to `maxLen` characters, appending "…" if truncated.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (str, maxLen = 80) =>
  str && str.length > maxLen ? str.slice(0, maxLen) + '…' : str;

/**
 * Return the first character of a string, uppercased — used for avatars.
 * @param {string} name
 * @returns {string}
 */
export const getInitial = (name = '') => name.charAt(0).toUpperCase();

/**
 * Build a simple query-string from a plain object, omitting empty values.
 * @param {Record<string, any>} params
 * @returns {string}  e.g. "?category=sayuran&sort=cheapest"
 */
export const buildQuery = (params) => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
};
