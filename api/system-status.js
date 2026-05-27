function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export default function handler(_request, response) {
  sendJson(response, 200, {
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    digestEmailFromConfigured: Boolean(process.env.DIGEST_EMAIL_FROM),
    scheduledDigestConfigured: Boolean(process.env.RESEND_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseServiceConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    parentDigestEmailConfigured: Boolean(process.env.PARENT_DIGEST_EMAIL),
    requiredSupabaseScripts: [
      "000_run_all_learning_platform.sql",
      "001_base_learning_schema.sql",
      "003_seed_starter_questions.sql",
      "004_auth_and_plans.sql",
      "005_family_auth_helpers.sql",
      "009_mistake_reviews.sql",
      "010_skill_mastery.sql",
      "011_practice_sessions.sql",
      "012_learning_closure_tables.sql",
    ],
  });
}
