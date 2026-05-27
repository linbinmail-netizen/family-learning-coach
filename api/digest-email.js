const defaultFrom = "Family Learning Coach <onboarding@resend.dev>";

export function buildDigestHtml({ title = "Family Learning Coach Daily Digest", body = "" } = {}) {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body).replace(/\n/g, "<br />");
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2933;">
      <h2>${safeTitle}</h2>
      <div>${safeBody}</div>
    </div>
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    sendJson(response, 501, { error: "Email provider is not configured." });
    return;
  }

  const { to, subject, body } = request.body || {};
  if (!to || !subject || !body) {
    sendJson(response, 400, { error: "Missing to, subject, or body." });
    return;
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.DIGEST_EMAIL_FROM || defaultFrom,
      to,
      subject,
      html: buildDigestHtml({ title: subject, body }),
    }),
  });

  const data = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    sendJson(response, 400, { error: data?.message || "Email send failed.", details: data });
    return;
  }

  sendJson(response, 200, { id: data?.id || "", sent: true });
}
