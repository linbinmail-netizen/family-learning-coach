function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export default function handler(_request, response) {
  sendJson(response, 200, {
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    digestEmailFromConfigured: Boolean(process.env.DIGEST_EMAIL_FROM),
    requiredSupabaseScripts: ["010_skill_mastery.sql", "011_practice_sessions.sql"],
  });
}
