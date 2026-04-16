import { describe, it, expect } from 'vitest';
import { kpiCards } from '../../data/mockKpis';
import { mockEvalDataset } from '../../data/mockEvalData';
import { blockedArticles, recentIncidents } from '../../data/mockTables';
import { actionItems } from '../../data/mockActions';
import * as mockDrilldown from '../../data/mockDrilldown';

describe('Mock data', () => {
  describe('kpiCards', () => {
    it('has 8 items', () => {
      expect(kpiCards).toHaveLength(8);
    });

    it('each item has required fields', () => {
      for (const card of kpiCards) {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('label');
        expect(card).toHaveProperty('value');
        expect(card).toHaveProperty('trend');
        expect(card).toHaveProperty('trendLabel');
        expect(card).toHaveProperty('positiveIsUp');
      }
    });
  });

  describe('mockEvalDataset', () => {
    it('has at least 1 row', () => {
      expect(mockEvalDataset.rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('blockedArticles', () => {
    it('has items with required fields', () => {
      expect(blockedArticles.length).toBeGreaterThan(0);
      for (const row of blockedArticles) {
        expect(row).toHaveProperty('id');
        expect(row).toHaveProperty('article');
        expect(row).toHaveProperty('lob');
        expect(row).toHaveProperty('owner');
        expect(row).toHaveProperty('reason');
        expect(row).toHaveProperty('ageDays');
      }
    });
  });

  describe('recentIncidents', () => {
    it('has items with required fields', () => {
      expect(recentIncidents.length).toBeGreaterThan(0);
      for (const row of recentIncidents) {
        expect(row).toHaveProperty('id');
        expect(row).toHaveProperty('lob');
        expect(row).toHaveProperty('status');
        expect(row).toHaveProperty('opened');
        expect(row).toHaveProperty('summary');
      }
    });
  });

  describe('actionItems', () => {
    it('has items with required fields', () => {
      expect(actionItems.length).toBeGreaterThan(0);
      for (const item of actionItems) {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('priority');
      }
    });
  });

  describe('mockDrilldown exports', () => {
    it('all exports are Records with string keys and array values', () => {
      for (const [exportName, value] of Object.entries(mockDrilldown)) {
        expect(typeof value, `${exportName} should be an object`).toBe('object');
        expect(value, `${exportName} should not be null`).not.toBeNull();
        for (const [key, rows] of Object.entries(value as Record<string, unknown>)) {
          expect(typeof key, `${exportName}[${key}] key should be string`).toBe('string');
          expect(Array.isArray(rows), `${exportName}[${key}] should be an array`).toBe(true);
        }
      }
    });
  });
});
