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

  /**
   * Power Automate / Azure Function URL for New Partner Onboarding → ADO Task creation.
   */
  ONBOARDING_FLOW_URL: '',

  /**
   * Deep link URL for the Teams Knowledge Bot.
   * e.g. https://teams.microsoft.com/l/chat/0/0?users=28:bot-id
   * Leave empty to show "coming soon" state.
   */
  TEAMS_BOT_URL: 'https://teams.microsoft.com/l/app/1ef3c012-7ba0-4e29-b6e7-e724183ab93f?source=app-header-share-entrypoint&templateInstanceId=cc587468-85eb-45e1-929d-06aae6f6d4e5&environment=033fc568-1ab1-ee30-8eb1-1ba1faa87719',
  FEEDBACK_EMAIL: 'SxGCorePM@microsoft.com',
};
