import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSFIncitingIncident, sfIncitingIncidents } from './starforgedOracles';
import * as oracles from './oracles';

describe('starforgedOracles', () => {
  describe('generateSFIncitingIncident', () => {
    let rollDiceSpy;

    beforeEach(() => {
      rollDiceSpy = vi.spyOn(oracles, 'rollDice');
    });

    afterEach(() => {
      rollDiceSpy.mockRestore();
    });

    it('should return valid structure with all required fields', () => {
      rollDiceSpy.mockReturnValue(1);
      
      const result = generateSFIncitingIncident();
      
      expect(result).toHaveProperty('roll');
      expect(result).toHaveProperty('incident');
      expect(result).toHaveProperty('source');
    });

    it('should have source set to starforged', () => {
      rollDiceSpy.mockReturnValue(1);
      
      const result = generateSFIncitingIncident();
      
      expect(result.source).toBe('starforged');
    });

    it('should return first incident when roll is 1', () => {
      rollDiceSpy.mockReturnValue(1);
      
      const result = generateSFIncitingIncident();
      
      expect(result.roll).toBe(1);
      expect(result.incident).toBe(sfIncitingIncidents[0].incident);
    });

    it('should return last incident when roll is max', () => {
      const maxRoll = sfIncitingIncidents.length;
      rollDiceSpy.mockReturnValue(maxRoll);
      
      const result = generateSFIncitingIncident();
      
      expect(result.roll).toBe(maxRoll);
      expect(result.incident).toBe(sfIncitingIncidents[maxRoll - 1].incident);
    });

    it('should return middle incident when roll is in middle', () => {
      const middleRoll = Math.ceil(sfIncitingIncidents.length / 2);
      rollDiceSpy.mockReturnValue(middleRoll);
      
      const result = generateSFIncitingIncident();
      
      expect(result.roll).toBe(middleRoll);
      expect(result.incident).toBe(sfIncitingIncidents[middleRoll - 1].incident);
    });

    it('should call rollDice with correct array length', () => {
      rollDiceSpy.mockReturnValue(1);
      
      generateSFIncitingIncident();
      
      expect(rollDiceSpy).toHaveBeenCalledWith(sfIncitingIncidents.length);
      expect(rollDiceSpy).toHaveBeenCalledWith(19); // Known length
    });

    it('should return different incidents for different rolls', () => {
      rollDiceSpy.mockReturnValue(1);
      const result1 = generateSFIncitingIncident();
      
      rollDiceSpy.mockReturnValue(10);
      const result2 = generateSFIncitingIncident();
      
      expect(result1.incident).not.toBe(result2.incident);
    });

    it('should always return a string incident', () => {
      for (let i = 1; i <= sfIncitingIncidents.length; i++) {
        rollDiceSpy.mockReturnValue(i);
        const result = generateSFIncitingIncident();
        
        expect(typeof result.incident).toBe('string');
        expect(result.incident.length).toBeGreaterThan(0);
      }
    });

    it('should have 19 incidents in the array', () => {
      // This ensures the table hasn't been accidentally modified
      expect(sfIncitingIncidents).toHaveLength(19);
    });

    it('should have all incidents as strings', () => {
      sfIncitingIncidents.forEach((entry) => {
        expect(entry).toHaveProperty('incident');
        expect(typeof entry.incident).toBe('string');
        expect(entry.incident.length).toBeGreaterThan(0);
      });
    });

    it('should not include Prison Break incident', () => {
      // Verify that the duplicate "Prison Break" from Starforged is not present
      const incidents = sfIncitingIncidents.map(i => i.incident.toLowerCase());
      const prisonBreakCount = incidents.filter(i => i.includes('prison')).length;
      
      expect(prisonBreakCount).toBe(0);
    });
  });

  describe('sfIncitingIncidents data integrity', () => {
    it('should have unique incidents', () => {
      const incidents = sfIncitingIncidents.map(i => i.incident);
      const uniqueIncidents = new Set(incidents);
      
      expect(uniqueIncidents.size).toBe(incidents.length);
    });

    it('should have properly formatted incidents (ending with period)', () => {
      sfIncitingIncidents.forEach((entry) => {
        expect(entry.incident.endsWith('.')).toBe(true);
      });
    });

    it('should have incidents starting with capital letter', () => {
      sfIncitingIncidents.forEach((entry) => {
        const firstChar = entry.incident.charAt(0);
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });
  });
});
