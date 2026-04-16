import { describe, it, expect } from 'vitest';
import { CONFIG } from '../config';

describe('CONFIG', () => {
  it('has all required keys', () => {
    expect(CONFIG).toHaveProperty('FEEDBACK_FLOW_URL');
    expect(CONFIG).toHaveProperty('FEATURE_REQUEST_FLOW_URL');
    expect(CONFIG).toHaveProperty('INGESTION_FLOW_URL');
    expect(CONFIG).toHaveProperty('REMOVAL_FLOW_URL');
    expect(CONFIG).toHaveProperty('ONBOARDING_FLOW_URL');
    expect(CONFIG).toHaveProperty('TEAMS_BOT_URL');
    expect(CONFIG).toHaveProperty('FEEDBACK_EMAIL');
  });

  it('FEEDBACK_EMAIL is SxGCorePM@microsoft.com', () => {
    expect(CONFIG.FEEDBACK_EMAIL).toBe('SxGCorePM@microsoft.com');
  });

  it('TEAMS_BOT_URL contains teams.microsoft.com', () => {
    expect(CONFIG.TEAMS_BOT_URL).toContain('teams.microsoft.com');
  });
});
