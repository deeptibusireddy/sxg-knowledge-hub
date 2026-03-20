/**
 * App-wide configuration.
 * Replace the placeholder URLs with real Power Automate HTTP trigger endpoints.
 */
export const CONFIG = {
  /**
   * Power Automate HTTP trigger URL for the Give Feedback form.
   * Leave empty to show a "not configured" message in dev.
   * Flow should accept: { category, subject, feedback, rating, alias, submittedAt }
   */
  FEEDBACK_FLOW_URL: '',

  /** Reply-to / destination shown in the mailto fallback */
  FEEDBACK_EMAIL: 'SxGCorePM@microsoft.com',
};
