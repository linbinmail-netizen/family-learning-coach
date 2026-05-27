import {
  buildMasteryReport,
  buildStudentDashboard,
  generateDailyPlan,
  reviewMistakeRecord,
  sendJson,
  submitAnswerRecord,
  updateLearningSettings,
} from "../lib/learning-core.js";

export function handleLearningApi(request, response) {
  const body = request.body || {};
  const method = request.method || "GET";
  const action = request.query?.action || "";
  const studentId = request.query?.id || body.studentId || "student";

  if (action === "student-dashboard" && (method === "GET" || method === "POST")) {
    sendJson(response, 200, buildStudentDashboard({ studentId, ...body }));
    return;
  }
  if (action === "student-daily-plan" && (method === "GET" || method === "POST")) {
    sendJson(response, 200, generateDailyPlan({ studentId, ...body }));
    return;
  }
  if (action === "student-generate-plan" && method === "POST") {
    sendJson(response, 200, generateDailyPlan({ studentId, ...body }));
    return;
  }
  if (action === "student-mistakes" && (method === "GET" || method === "POST")) {
    const mistakes = body.mistakes || [];
    sendJson(response, 200, {
      studentId,
      mistakes: mistakes.filter((mistake) => !mistake.studentId || mistake.studentId === studentId),
    });
    return;
  }
  if (action === "student-mastery-report" && (method === "GET" || method === "POST")) {
    sendJson(response, 200, { studentId, ...buildMasteryReport(body) });
    return;
  }
  if (action === "answer-submit" && method === "POST") {
    sendJson(response, 200, submitAnswerRecord(body));
    return;
  }
  if (action === "mistake-review" && method === "POST") {
    sendJson(response, 200, reviewMistakeRecord(body));
    return;
  }
  if (action === "learning-settings-update" && method === "POST") {
    const { current = {}, updates = {} } = body;
    sendJson(response, 200, {
      saved: true,
      settings: updateLearningSettings(current, updates),
    });
    return;
  }

  sendJson(response, 404, { error: "Learning API route not found.", action });
}

export default function handler(request, response) {
  handleLearningApi(request, response);
}
