export function validateRequest(payload) {
  const errors = {};
  if (!payload.title || payload.title.trim().length < 6) errors.title = "Title must be at least 6 characters.";
  if (!payload.description || payload.description.trim().length < 20) errors.description = "Description must be at least 20 characters.";
  if (!payload.category) errors.category = "Choose a category.";
  if (!payload.location || payload.location.trim().length < 2) errors.location = "Enter a location.";
  return { ok: Object.keys(errors).length === 0, errors };
}
export function validateResponse(payload) {
  const errors = {};
  if (!payload.message || payload.message.trim().length < 4) errors.message = "Write a short message.";
  return { ok: Object.keys(errors).length === 0, errors };
}
