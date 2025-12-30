// Ship Upgrade Utility Functions

/**
 * Check if ship has a specific upgrade installed
 * @param {Object} ship - Ship state object
 * @param {string} upgradeId - ID of the upgrade to check
 * @returns {boolean}
 */
export function hasUpgrade(ship, upgradeId) {
  if (!ship) return false;
  return (
    ship.heroicUpgrades.includes(upgradeId) ||
    ship.purchasedUpgrades.includes(upgradeId)
  );
}

/**
 * Check if player can afford to purchase an upgrade
 * @param {number} bits - Current Bits count
 * @param {number} cost - Upgrade cost
 * @returns {boolean}
 */
export function canPurchase(bits, cost) {
  return bits >= cost;
}

/**
 * Get maximum armor tier based on ship upgrades
 * @param {Object} ship - Ship state object
 * @returns {number} - Max tier (2 or 3)
 */
export function getMaxArmorTier(ship) {
  return hasUpgrade(ship, 'overchargeShields') ? 3 : 2;
}

/**
 * Get gunner damage based on turbo laser upgrade
 * @param {Object} ship - Ship state object
 * @param {string} stationId - Station ID (gunner1 or gunner2)
 * @returns {string} - Damage dice (1d6 or 1d8)
 */
export function getGunnerDamage(ship, stationId) {
  if (hasUpgrade(ship, 'turboLasers') && ship.turboLaserStation === stationId) {
    return '1d8';
  }
  return '1d6';
}

/**
 * Get number of targets for Steady action
 * @param {Object} ship - Ship state object
 * @returns {number|string} - 1 or 'D2' if Booster Rockets installed
 */
export function getSteadyTargetCount(ship) {
  return hasUpgrade(ship, 'boosterRockets') ? 'D2' : 1;
}

/**
 * Check if any station can load torpedoes
 * @param {Object} ship - Ship state object
 * @returns {boolean}
 */
export function canAnyStationLoadTorpedoes(ship) {
  return hasUpgrade(ship, 'torpedoWinch');
}

/**
 * Get available torpedo types with quantities
 * @param {Object} ship - Ship state object
 * @returns {Array} - Array of torpedo types with counts > 0
 */
export function getAvailableTorpedoes(ship) {
  if (!ship || !ship.torpedoInventory) return [];
  
  return Object.entries(ship.torpedoInventory)
    .filter(([type, count]) => count > 0)
    .map(([type, count]) => ({ type, count }));
}

/**
 * Get total torpedo count
 * @param {Object} ship - Ship state object
 * @returns {number}
 */
export function getTotalTorpedoCount(ship) {
  if (!ship || !ship.torpedoInventory) return 0;
  
  return Object.values(ship.torpedoInventory).reduce((sum, count) => sum + count, 0);
}

/**
 * Check if ship has specific torpedo type available
 * @param {Object} ship - Ship state object
 * @param {string} torpedoType - Type of torpedo
 * @returns {boolean}
 */
export function hasTorpedoType(ship, torpedoType) {
  return ship && ship.torpedoInventory && ship.torpedoInventory[torpedoType] > 0;
}

/**
 * Get all installed upgrades (heroic + purchased)
 * @param {Object} ship - Ship state object
 * @returns {Array} - Array of upgrade IDs
 */
export function getAllUpgrades(ship) {
  if (!ship) return [];
  return [...ship.heroicUpgrades, ...ship.purchasedUpgrades];
}

/**
 * Check if ship can earn a heroic upgrade
 * @param {Object} ship - Ship state object
 * @returns {boolean}
 */
export function canEarnHeroicUpgrade(ship) {
  if (!ship) return false;
  // Can earn a heroic upgrade if galaxies saved > heroic upgrades installed
  return ship.galaxiesSaved > ship.heroicUpgrades.length;
}

/**
 * Get available heroic upgrade slots
 * @param {Object} ship - Ship state object
 * @returns {number}
 */
export function getAvailableHeroicSlots(ship) {
  if (!ship) return 0;
  return Math.max(0, ship.galaxiesSaved - ship.heroicUpgrades.length);
}
