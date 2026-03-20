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

  /**
   * Power Automate / Azure Function URL for Feature Request → ADO Task creation.
   * Leave empty to fall back to mailto.
   * Flow should accept the full feature request payload.
   */
  FEATURE_REQUEST_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for Content Ingestion → ADO Task creation.
   */
  INGESTION_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for Content Removal → ADO Task creation.
   */
  REMOVAL_FLOW_URL: '',

  /** Reply-to / destination shown in the mailto fallback */
  FEEDBACK_EMAIL: 'SxGCorePM@microsoft.com',
};
