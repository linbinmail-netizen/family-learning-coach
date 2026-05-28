function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

const requiredSupabaseScripts = [
  "000_run_all_learning_platform.sql",
  "001_base_learning_schema.sql",
  "003_seed_starter_questions.sql",
  "004_auth_and_plans.sql",
  "005_family_auth_helpers.sql",
  "009_mistake_reviews.sql",
  "010_skill_mastery.sql",
  "011_practice_sessions.sql",
  "012_learning_closure_tables.sql",
];

export default function handler(_request, response) {
  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const supabaseServiceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const parentDigestEmailConfigured = Boolean(process.env.PARENT_DIGEST_EMAIL);
  const scheduledDigestConfigured = Boolean(emailConfigured && supabaseServiceConfigured);
  const learningApiConfigured = true;
  const databaseSetupReady = true;
  const launchChecklist = [
    {
      id: "database",
      label: "数据库结构",
      ready: databaseSetupReady,
      action: "运行 supabase/000_run_all_learning_platform.sql",
    },
    {
      id: "learning-api",
      label: "学习 API",
      ready: learningApiConfigured,
      action: "已启用今日计划、答题提交、错题复习、掌握报告接口",
    },
    {
      id: "openai",
      label: "AI 引导",
      ready: openAiConfigured,
      action: "配置 OPENAI_API_KEY；未配置时系统会自动使用本地教练引导",
    },
    {
      id: "email",
      label: "家长邮件",
      ready: scheduledDigestConfigured,
      action: "配置 RESEND_API_KEY、SUPABASE_SERVICE_ROLE_KEY、PARENT_DIGEST_EMAIL",
    },
  ];

  sendJson(response, 200, {
    emailConfigured,
    openAiConfigured,
    digestEmailFromConfigured: Boolean(process.env.DIGEST_EMAIL_FROM),
    scheduledDigestConfigured,
    supabaseServiceConfigured,
    parentDigestEmailConfigured,
    learningApiConfigured,
    databaseSetupReady,
    requiredSupabaseScripts,
    launchChecklist,
  });
}
