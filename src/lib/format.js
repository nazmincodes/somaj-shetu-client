export function formatDate(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isPast(value) {
  return new Date(value) <= new Date();
}

// value for <input type="datetime-local">
export function toLocalInput(value) {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function safeRedirect(path) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}
