import { buildDigestHtml } from "./digest-email.js";

const defaultSupabaseUrl = "https://olyehadsblazpyxhsryn.supabase.co";
const defaultParentEmail = "linbinmail@gmail.com";

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function todayStartIso(now = new Date()) {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
}

function supabaseHeaders() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

async function supabaseSelect(path) {
  const supabaseUrl = process.env.SUPABASE_URL || defaultSupabaseUrl;
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: supabaseHeaders(),
  });
  if (!response.ok) throw new Error(`Supabase read failed: ${path}`);
  return response.json();
}

function summarizeStudent({ student, sessions = [], mistakes = [], mastery = [] }) {
  const answered = sessions.reduce((sum, session) => sum + (session.questions_answered || 0), 0);
  const correct = sessions.reduce((sum, session) => sum + (session.correct_count || 0), 0);
  const hints = sessions.reduce((sum, session) => sum + (session.hints_used || 0), 0);
  const slow = sessions.reduce((sum, session) => sum + (session.slow_count || 0), 0);
  const guessing = sessions.reduce((sum, session) => sum + (session.guessing_count || 0), 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  const weakSkills = [
    ...new Set(
      mastery
        .filter((item) => item.status === "needs_review" || (item.mastery || 0) < 60)
        .map((item) => item.skill)
        .concat(mistakes.map((item) => item.skill))
        .filter(Boolean)
    ),
  ].slice(0, 4);

  return {
    name: student.display_name || "Student",
    answered,
    correct,
    accuracy,
    hints,
    slow,
    guessing,
    mistakes: mistakes.length,
    weakSkills,
    recommendation: weakSkills.length
      ? `Tomorrow, review ${weakSkills[0]} first, then do a short similar-practice set.`
      : answered
        ? "Tomorrow, keep the same plan and add one challenge question."
        : "Tomorrow, start with the Daily Mission and complete at least one guided practice block.",
  };
}

export function buildDailyDigestText(summaries = [], now = new Date()) {
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
  const lines = [`Family Learning Coach Daily Digest - ${date}`, ""];
  if (!summaries.length) {
    lines.push("No student learning activity was recorded today.");
    return lines.join("\n");
  }

  for (const summary of summaries) {
    lines.push(`${summary.name}`);
    lines.push(`- Questions: ${summary.answered}, Correct: ${summary.correct}, Accuracy: ${summary.accuracy || "--"}%`);
    lines.push(`- Hints used: ${summary.hints}, Slow mastery signals: ${summary.slow}, Possible guessing: ${summary.guessing}`);
    lines.push(`- Open mistakes: ${summary.mistakes}`);
    lines.push(`- Weak skills: ${summary.weakSkills.length ? summary.weakSkills.join(", ") : "None yet"}`);
    lines.push(`- Recommendation: ${summary.recommendation}`);
    lines.push("");
  }
  return lines.join("\n");
}

async function sendDigestEmail({ to, subject, body }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.DIGEST_EMAIL_FROM || "Family Learning Coach <onboarding@resend.dev>",
      to,
      subject,
      html: buildDigestHtml({ title: subject, body }),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Resend request failed");
  return data;
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = request.headers?.["x-cron-secret"] || request.query?.secret;
  if (cronSecret && providedSecret !== cronSecret) {
    sendJson(response, 401, { error: "Unauthorized" });
    return;
  }

  if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    sendJson(response, 501, { error: "Scheduled digest is not configured." });
    return;
  }

  const since = todayStartIso();
  const students = await supabaseSelect("students?select=id,display_name&order=display_name.asc");
  const sessions = await supabaseSelect(
    `practice_sessions?select=student_id,questions_answered,correct_count,hints_used,slow_count,guessing_count&started_at=gte.${encodeURIComponent(since)}`
  );
  const mistakes = await supabaseSelect(
    `mistake_reviews?select=student_id,skill,resolved,last_missed_at&resolved=eq.false`
  );
  const mastery = await supabaseSelect(
    "skill_mastery?select=student_id,skill,mastery,status"
  );

  const summaries = students.map((student) =>
    summarizeStudent({
      student,
      sessions: sessions.filter((item) => item.student_id === student.id),
      mistakes: mistakes.filter((item) => item.student_id === student.id),
      mastery: mastery.filter((item) => item.student_id === student.id),
    })
  );
  const body = buildDailyDigestText(summaries);
  const to = process.env.PARENT_DIGEST_EMAIL || defaultParentEmail;
  const subject = "Family Learning Coach Daily Digest";
  const email = await sendDigestEmail({ to, subject, body });

  sendJson(response, 200, { sent: true, id: email?.id || "", students: summaries.length });
}
