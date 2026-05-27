import { sendJson } from "../../learning-core.js";

export default function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const id = request.query?.id || request.url?.split("/api/student/")[1]?.split("/")[0] || "student";
  const mistakes = request.body?.mistakes || [];
  sendJson(response, 200, {
    studentId: id,
    mistakes: mistakes.filter((mistake) => !mistake.studentId || mistake.studentId === id),
  });
}
