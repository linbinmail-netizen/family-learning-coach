import { reviewMistakeRecord, sendJson } from "../learning-core.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  sendJson(response, 200, reviewMistakeRecord(request.body || {}));
}
