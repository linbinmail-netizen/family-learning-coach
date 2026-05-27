import {
  buildMasteryReport,
  buildStudentDashboard,
  generateDailyPlan,
  reviewMistakeRecord,
  sendJson,
  submitAnswerRecord,
  updateLearningSettings,
} from "../lib/learning-core.js";

function routeParts(request) {
  const raw = request.query?.path || request.url?.split("/api/")[1]?.split("?")[0] || "";
  return Array.isArray(raw) ? raw : String(raw).split("/").filter(Boolean);
}

export function handleLearningApi(request, response) {
  const parts = routeParts(request);
  const body = request.body || {};
  const method = request.method || "GET";

  if (parts[0] === "student" && parts[1]) {
    const studentId = parts[1];
    const action = parts[2];

    if (action === "dashboard" && (method === "GET" || method === "POST")) {
      sendJson(response, 200, buildStudentDashboard({ studentId, ...body }));
      return;
    }
    if (action === "daily-plan" && (method === "GET" || method === "POST")) {
      sendJson(response, 200, generateDailyPlan({ studentId, ...body }));
      return;
    }
    if (action === "generate-plan" && method === "POST") {
      sendJson(response, 200, generateDailyPlan({ studentId, ...body }));
      return;
    }
    if (action === "mistakes" && (method === "GET" || method === "POST")) {
      const mistakes = body.mistakes || [];
      sendJson(response, 200, {
        studentId,
        mistakes: mistakes.filter((mistake) => !mistake.studentId || mistake.studentId === studentId),
      });
      return;
    }
    if (action === "mastery-report" && (method === "GET" || method === "POST")) {
      sendJson(response, 200, { studentId, ...buildMasteryReport(body) });
      return;
    }
  }

  if (parts.join("/") === "answer/submit" && method === "POST") {
    sendJson(response, 200, submitAnswerRecord(body));
    return;
  }

  if (parts.join("/") === "mistake/review" && method === "POST") {
    sendJson(response, 200, reviewMistakeRecord(body));
    return;
  }

  if (parts.join("/") === "learning-settings/update" && method === "POST") {
    const { current = {}, updates = {} } = body;
    sendJson(response, 200, {
      saved: true,
      settings: updateLearningSettings(current, updates),
    });
    return;
  }

  sendJson(response, 404, { error: "Learning API route not found.", path: parts.join("/") });
}

export default function handler(request, response) {
  handleLearningApi(request, response);
}
