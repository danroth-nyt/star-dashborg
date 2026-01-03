import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rollD,
  rollDice,
  roll3d6,
  rollWithModifier,
  sumToModifier,
  rollStat,
  rollStatWithModifier,
  rollD20,
  rollWithAdvantage,
  rollWithDisadvantage,
  rollTest,
  rollDamage,
  rollTable,
  rollBits,
  rollHP,
  rollDestinyPoints,
} from './dice';

describe('dice utilities', () => {
  describe('sumToModifier', () => {
    it('should return -3 for sum 3-4', () => {
      expect(sumToModifier(3)).toBe(-3);
      expect(sumToModifier(4)).toBe(-3);
    });

    it('should return -2 for sum 5-6', () => {
      expect(sumToModifier(5)).toBe(-2);
      expect(sumToModifier(6)).toBe(-2);
    });

    it('should return -1 for sum 7-8', () => {
      expect(sumToModifier(7)).toBe(-1);
      expect(sumToModifier(8)).toBe(-1);
    });

    it('should return 0 for sum 9-12', () => {
      expect(sumToModifier(9)).toBe(0);
      expect(sumToModifier(10)).toBe(0);
      expect(sumToModifier(11)).toBe(0);
      expect(sumToModifier(12)).toBe(0);
    });

    it('should return 1 for sum 13-14', () => {
      expect(sumToModifier(13)).toBe(1);
      expect(sumToModifier(14)).toBe(1);
    });

    it('should return 2 for sum 15-16', () => {
      expect(sumToModifier(15)).toBe(2);
      expect(sumToModifier(16)).toBe(2);
    });

    it('should return 3 for sum 17+', () => {
      expect(sumToModifier(17)).toBe(3);
      expect(sumToModifier(18)).toBe(3);
      expect(sumToModifier(20)).toBe(3);
    });

    it('should handle edge cases below 3', () => {
      expect(sumToModifier(1)).toBe(-3);
      expect(sumToModifier(2)).toBe(-3);
    });
  });

  describe('rollD with mocked random', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should return 1 when random is 0', () => {
      randomSpy.mockReturnValue(0);
      expect(rollD(6)).toBe(1);
      expect(rollD(20)).toBe(1);
    });

    it('should return max value when random is close to 1', () => {
      randomSpy.mockReturnValue(0.999);
      expect(rollD(6)).toBe(6);
      expect(rollD(20)).toBe(20);
    });

    it('should return middle value for d6', () => {
      randomSpy.mockReturnValue(0.5);
      expect(rollD(6)).toBe(4);
    });
  });

  describe('rollDice', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should sum multiple dice rolls', () => {
      randomSpy.mockReturnValue(0.5); // Should give middle values
      const result = rollDice(2, 6);
      expect(result).toBe(8); // 4 + 4
    });

    it('should handle single die roll', () => {
      randomSpy.mockReturnValue(0);
      expect(rollDice(1, 20)).toBe(1);
    });
  });

  describe('roll3d6', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should roll 3d6 and return sum', () => {
      randomSpy.mockReturnValue(0); // All 1s
      expect(roll3d6()).toBe(3);
    });
  });

  describe('rollWithModifier', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should add positive modifier', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      expect(rollWithModifier(1, 6, 3)).toBe(4); // 1 + 3
    });

    it('should subtract negative modifier', () => {
      randomSpy.mockReturnValue(0.999); // Roll 6
      expect(rollWithModifier(1, 6, -2)).toBe(4); // 6 - 2
    });

    it('should return minimum of 1', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      expect(rollWithModifier(1, 6, -5)).toBe(1); // 1 - 5 = -4, clamped to 1
    });
  });

  describe('rollTest', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should detect success when total >= DR', () => {
      randomSpy.mockReturnValue(0.9); // Roll 19
      const result = rollTest(2, 20);
      expect(result.roll).toBe(19);
      expect(result.total).toBe(21);
      expect(result.success).toBe(true);
      expect(result.crit).toBe(false);
      expect(result.blunder).toBe(false);
    });

    it('should detect failure when total < DR', () => {
      randomSpy.mockReturnValue(0.4); // Roll 9
      const result = rollTest(0, 15);
      expect(result.roll).toBe(9);
      expect(result.total).toBe(9);
      expect(result.success).toBe(false);
    });

    it('should detect critical hit on natural 20', () => {
      randomSpy.mockReturnValue(0.95); // Roll 20
      const result = rollTest(0, 10);
      expect(result.crit).toBe(true);
      expect(result.success).toBe(true);
    });

    it('should detect blunder on natural 1', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      const result = rollTest(5, 10);
      expect(result.blunder).toBe(true);
      expect(result.total).toBe(6);
    });

    it('should handle advantage (take best of two rolls)', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.3 : 0.7; // First roll 7, second roll 15
      });
      const result = rollTest(0, 10, true, false);
      expect(result.roll).toBe(15); // Should take higher roll
      expect(result.success).toBe(true);
    });

    it('should handle disadvantage (take worst of two rolls)', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.7 : 0.3; // First roll 15, second roll 7
      });
      const result = rollTest(0, 10, false, true);
      expect(result.roll).toBe(7); // Should take lower roll
      expect(result.success).toBe(false);
    });
  });

  describe('rollDamage', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should calculate damage without armor', () => {
      randomSpy.mockReturnValue(0.5); // Middle roll
      const result = rollDamage(2, 6, null);
      expect(result.damage).toBe(8); // 4 + 4
      expect(result.armorReduction).toBe(0);
      expect(result.totalDamage).toBe(8);
    });

    it('should reduce damage by armor', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount <= 2 ? 0.8 : 0.3; // Damage rolls 5+5=10, armor roll 2
      });
      const result = rollDamage(2, 6, { count: 1, sides: 6 });
      expect(result.damage).toBe(10);
      expect(result.armorReduction).toBe(2);
      expect(result.totalDamage).toBe(8);
    });

    it('should return minimum 0 damage after armor', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0 : 0.9; // Damage roll 1, armor roll 6
      });
      const result = rollDamage(1, 6, { count: 1, sides: 6 });
      expect(result.totalDamage).toBe(0);
    });
  });

  describe('rollWithAdvantage and rollWithDisadvantage', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('rollWithAdvantage should return max of two rolls', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.4 : 0.8;
      });
      expect(rollWithAdvantage()).toBe(17);
    });

    it('rollWithDisadvantage should return min of two rolls', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.8 : 0.4;
      });
      expect(rollWithDisadvantage()).toBe(9);
    });
  });

  describe('rollTable', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should roll within table bounds', () => {
      randomSpy.mockReturnValue(0);
      expect(rollTable(10)).toBe(1);
      
      randomSpy.mockReturnValue(0.999);
      expect(rollTable(10)).toBe(10);
    });
  });

  describe('rollBits', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should return false for rolls 1-3', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      expect(rollBits()).toBe(false);
      
      randomSpy.mockReturnValue(0.4); // Roll 3
      expect(rollBits()).toBe(false);
    });

    it('should return true for rolls 4-6', () => {
      randomSpy.mockReturnValue(0.5); // Roll 4
      expect(rollBits()).toBe(true);
      
      randomSpy.mockReturnValue(0.999); // Roll 6
      expect(rollBits()).toBe(true);
    });
  });

  describe('rollHP', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should add STR modifier to HP roll', () => {
      randomSpy.mockReturnValue(0.5); // Middle roll (5 for d8)
      const result = rollHP(2, { count: 1, sides: 8, modifier: 0 });
      expect(result).toBe(7); // 5 + 2
    });

    it('should apply dice modifier', () => {
      randomSpy.mockReturnValue(0.5); // Middle roll
      const result = rollHP(0, { count: 1, sides: 8, modifier: 3 });
      expect(result).toBe(8); // 5 + 3 + 0
    });

    it('should ignore STR modifier for bots (METAL rule)', () => {
      randomSpy.mockReturnValue(0.5);
      const result = rollHP(2, { count: 1, sides: 8, modifier: 0, ignoreSTR: true });
      expect(result).toBe(5); // 5 only, ignores STR
    });

    it('should return minimum 1 HP', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      const result = rollHP(-3, { count: 1, sides: 8, modifier: -2 });
      expect(result).toBe(1); // 1 - 2 - 3 = -4, clamped to 1
    });
  });

  describe('rollDestinyPoints', () => {
    let randomSpy;

    beforeEach(() => {
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('should roll destiny dice', () => {
      randomSpy.mockReturnValue(0); // Roll 1
      expect(rollDestinyPoints({ count: 1, sides: 2 })).toBe(1);
      
      randomSpy.mockReturnValue(0.999); // Roll 2
      expect(rollDestinyPoints({ count: 1, sides: 2 })).toBe(2);
    });

    it('should handle multiple destiny dice', () => {
      randomSpy.mockReturnValue(0.5);
      const result = rollDestinyPoints({ count: 2, sides: 2 });
      expect(result).toBe(4); // 2 + 2
    });
  });
});
