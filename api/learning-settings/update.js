import { sendJson, updateLearningSettings } from "../learning-core.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const { current = {}, updates = {} } = request.body || {};
  sendJson(response, 200, {
    saved: true,
    settings: updateLearningSettings(current, updates),
  });
}
