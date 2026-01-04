import { describe, it, expect } from 'vitest';
import {
  hasUpgrade,
  canPurchase,
  getMaxArmorTier,
  getGunnerDamage,
  getSteadyTargetCount,
  canAnyStationLoadTorpedoes,
  getAvailableTorpedoes,
  getTotalTorpedoCount,
  hasTorpedoType,
  getAllUpgrades,
  canEarnHeroicUpgrade,
  getAvailableHeroicSlots,
} from './shipUpgrades';

describe('shipUpgrades utilities', () => {
  describe('hasUpgrade', () => {
    it('returns false for null ship', () => {
      expect(hasUpgrade(null, 'someUpgrade')).toBe(false);
    });

    it('returns false for undefined ship', () => {
      expect(hasUpgrade(undefined, 'someUpgrade')).toBe(false);
    });

    it('returns true if upgrade is in heroicUpgrades', () => {
      const ship = { heroicUpgrades: ['turboLasers'], purchasedUpgrades: [] };
      expect(hasUpgrade(ship, 'turboLasers')).toBe(true);
    });

    it('returns true if upgrade is in purchasedUpgrades', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: ['boosterRockets'] };
      expect(hasUpgrade(ship, 'boosterRockets')).toBe(true);
    });

    it('returns false if upgrade is not in either array', () => {
      const ship = { heroicUpgrades: ['turboLasers'], purchasedUpgrades: ['boosterRockets'] };
      expect(hasUpgrade(ship, 'overchargeShields')).toBe(false);
    });
  });

  describe('canPurchase', () => {
    it('returns true when bits >= cost', () => {
      expect(canPurchase(100, 50)).toBe(true);
      expect(canPurchase(50, 50)).toBe(true);
    });

    it('returns false when bits < cost', () => {
      expect(canPurchase(49, 50)).toBe(false);
      expect(canPurchase(0, 10)).toBe(false);
    });
  });

  describe('getMaxArmorTier', () => {
    it('returns 2 for ship without overchargeShields', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(getMaxArmorTier(ship)).toBe(2);
    });

    it('returns 3 for ship with overchargeShields heroic upgrade', () => {
      const ship = { heroicUpgrades: ['overchargeShields'], purchasedUpgrades: [] };
      expect(getMaxArmorTier(ship)).toBe(3);
    });

    it('returns 3 for ship with overchargeShields purchased upgrade', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: ['overchargeShields'] };
      expect(getMaxArmorTier(ship)).toBe(3);
    });
  });

  describe('getGunnerDamage', () => {
    it('returns 1d6 for gunner without turbo lasers', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [], turboLaserStation: null };
      expect(getGunnerDamage(ship, 'gunner1')).toBe('1d6');
    });

    it('returns 1d6 for gunner when turbo lasers assigned to different station', () => {
      const ship = { 
        heroicUpgrades: ['turboLasers'], 
        purchasedUpgrades: [], 
        turboLaserStation: 'gunner2' 
      };
      expect(getGunnerDamage(ship, 'gunner1')).toBe('1d6');
    });

    it('returns 1d8 for gunner with turbo lasers assigned to their station', () => {
      const ship = { 
        heroicUpgrades: ['turboLasers'], 
        purchasedUpgrades: [], 
        turboLaserStation: 'gunner1' 
      };
      expect(getGunnerDamage(ship, 'gunner1')).toBe('1d8');
    });

    it('returns 1d6 when turboLasers not installed even if turboLaserStation set', () => {
      const ship = { 
        heroicUpgrades: [], 
        purchasedUpgrades: [], 
        turboLaserStation: 'gunner1' 
      };
      expect(getGunnerDamage(ship, 'gunner1')).toBe('1d6');
    });
  });

  describe('getSteadyTargetCount', () => {
    it('returns 1 for ship without boosterRockets', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(getSteadyTargetCount(ship)).toBe(1);
    });

    it('returns D2 for ship with boosterRockets', () => {
      const ship = { heroicUpgrades: ['boosterRockets'], purchasedUpgrades: [] };
      expect(getSteadyTargetCount(ship)).toBe('D2');
    });
  });

  describe('canAnyStationLoadTorpedoes', () => {
    it('returns false without torpedoWinch upgrade', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(canAnyStationLoadTorpedoes(ship)).toBe(false);
    });

    it('returns true with torpedoWinch upgrade', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: ['torpedoWinch'] };
      expect(canAnyStationLoadTorpedoes(ship)).toBe(true);
    });
  });

  describe('getAvailableTorpedoes', () => {
    it('returns empty array for null ship', () => {
      expect(getAvailableTorpedoes(null)).toEqual([]);
    });

    it('returns empty array for ship without torpedoInventory', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(getAvailableTorpedoes(ship)).toEqual([]);
    });

    it('returns only torpedoes with count > 0', () => {
      const ship = {
        heroicUpgrades: [],
        purchasedUpgrades: [],
        torpedoInventory: {
          proton: 3,
          concussion: 0,
          ion: 2,
        },
      };
      const result = getAvailableTorpedoes(ship);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ type: 'proton', count: 3 });
      expect(result).toContainEqual({ type: 'ion', count: 2 });
    });
  });

  describe('getTotalTorpedoCount', () => {
    it('returns 0 for null ship', () => {
      expect(getTotalTorpedoCount(null)).toBe(0);
    });

    it('returns 0 for ship without torpedoInventory', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(getTotalTorpedoCount(ship)).toBe(0);
    });

    it('returns sum of all torpedo counts', () => {
      const ship = {
        heroicUpgrades: [],
        purchasedUpgrades: [],
        torpedoInventory: {
          proton: 3,
          concussion: 2,
          ion: 1,
        },
      };
      expect(getTotalTorpedoCount(ship)).toBe(6);
    });
  });

  describe('hasTorpedoType', () => {
    it('returns falsy for null ship', () => {
      expect(hasTorpedoType(null, 'proton')).toBeFalsy();
    });

    it('returns falsy for ship without torpedoInventory', () => {
      const ship = { heroicUpgrades: [], purchasedUpgrades: [] };
      expect(hasTorpedoType(ship, 'proton')).toBeFalsy();
    });

    it('returns false for torpedo type with 0 count', () => {
      const ship = {
        heroicUpgrades: [],
        purchasedUpgrades: [],
        torpedoInventory: { proton: 0 },
      };
      expect(hasTorpedoType(ship, 'proton')).toBe(false);
    });

    it('returns true for torpedo type with count > 0', () => {
      const ship = {
        heroicUpgrades: [],
        purchasedUpgrades: [],
        torpedoInventory: { proton: 5 },
      };
      expect(hasTorpedoType(ship, 'proton')).toBe(true);
    });
  });

  describe('getAllUpgrades', () => {
    it('returns empty array for null ship', () => {
      expect(getAllUpgrades(null)).toEqual([]);
    });

    it('returns combined heroic and purchased upgrades', () => {
      const ship = {
        heroicUpgrades: ['turboLasers', 'boosterRockets'],
        purchasedUpgrades: ['torpedoWinch'],
      };
      const result = getAllUpgrades(ship);
      expect(result).toHaveLength(3);
      expect(result).toContain('turboLasers');
      expect(result).toContain('boosterRockets');
      expect(result).toContain('torpedoWinch');
    });
  });

  describe('canEarnHeroicUpgrade', () => {
    it('returns false for null ship', () => {
      expect(canEarnHeroicUpgrade(null)).toBe(false);
    });

    it('returns false when galaxiesSaved <= heroicUpgrades.length', () => {
      const ship = {
        galaxiesSaved: 2,
        heroicUpgrades: ['turboLasers', 'boosterRockets'],
        purchasedUpgrades: [],
      };
      expect(canEarnHeroicUpgrade(ship)).toBe(false);
    });

    it('returns true when galaxiesSaved > heroicUpgrades.length', () => {
      const ship = {
        galaxiesSaved: 3,
        heroicUpgrades: ['turboLasers'],
        purchasedUpgrades: [],
      };
      expect(canEarnHeroicUpgrade(ship)).toBe(true);
    });
  });

  describe('getAvailableHeroicSlots', () => {
    it('returns 0 for null ship', () => {
      expect(getAvailableHeroicSlots(null)).toBe(0);
    });

    it('returns 0 when galaxiesSaved <= heroicUpgrades.length', () => {
      const ship = {
        galaxiesSaved: 1,
        heroicUpgrades: ['turboLasers', 'boosterRockets'],
        purchasedUpgrades: [],
      };
      expect(getAvailableHeroicSlots(ship)).toBe(0);
    });

    it('returns difference between galaxiesSaved and heroicUpgrades.length', () => {
      const ship = {
        galaxiesSaved: 5,
        heroicUpgrades: ['turboLasers'],
        purchasedUpgrades: [],
      };
      expect(getAvailableHeroicSlots(ship)).toBe(4);
    });
  });
});
