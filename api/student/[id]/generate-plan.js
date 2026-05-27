import { generateDailyPlan, sendJson } from "../../learning-core.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const id = request.query?.id || request.url?.split("/api/student/")[1]?.split("/")[0] || "student";
  sendJson(response, 200, generateDailyPlan({ studentId: id, ...(request.body || {}) }));
}
