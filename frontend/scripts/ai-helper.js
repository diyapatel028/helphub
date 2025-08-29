// Simple keyword-based recommender
export function recommendCategory(text) {
  const t = (text || "").toLowerCase();
  if (/\bblood|donat(e|ion)|o\+|a\+|b\+|ab\+|hospital\b/.test(t)) return "Blood Donation";
  if (/\blost|found|missing|retriever|wallet|phone\b/.test(t)) return "Lost & Found";
  if (/\bstudy|exam|partner|calculus|library\b/.test(t)) return "Study Partner";
  if (/\bcleanup|volunteer|drive|donation camp\b/.test(t)) return "Volunteer";
  if (/\bemergency|urgent|ride|help now\b/.test(t)) return "Emergency";
  return "";
}
