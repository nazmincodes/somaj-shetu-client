export function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return "";
}

export function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  return "";
}

export function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateEvent(v) {
  const e = {};
  if (v.title.trim().length < 5) e.title = "Title must be at least 5 characters";
  if (v.description.trim().length < 20) e.description = "Description must be at least 20 characters";
  if (!v.eventType) e.eventType = "Please choose an event type";
  if (!isValidUrl(v.thumbnail.trim())) e.thumbnail = "Please enter a valid image URL";
  if (v.location.trim().length < 3) e.location = "Location is required";
  if (!v.eventDate) e.eventDate = "Please choose a date and time";
  else if (new Date(v.eventDate) <= new Date()) e.eventDate = "Event date must be in the future";
  return e;
}
