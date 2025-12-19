export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try { return JSON.parse(raw); } 
  catch(e) { console.error(`Error parsing ${key}`, e); return defaultValue; }
}
