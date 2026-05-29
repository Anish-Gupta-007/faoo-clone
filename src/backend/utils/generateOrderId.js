/**
 * Generate a human-readable Faoo order ID.
 * Format: FAOO-YYYYMMDD-XXXX
 * Example: FAOO-20260424-0347
 *
 * The 4-digit suffix is a random number to avoid collisions.
 * For a production sequential counter, replace with a DB sequence.
 *
 * @returns {string}
 */
const generateOrderId = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const suffix   = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `FAOO-${datePart}-${suffix}`;
};

module.exports = generateOrderId;
