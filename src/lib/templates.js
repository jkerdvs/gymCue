import { v4 as uuidv4 } from "uuid";
import { getFromStorage, saveToStorage } from "./storage";

const T_KEY = "workoutTemplates";

export function getTemplates() {
  return getFromStorage(T_KEY, {});
}

export function saveTemplate(template) {
  const templates = getTemplates();
  const newTemplate = { id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...template };
  templates[newTemplate.id] = newTemplate;
  saveToStorage(T_KEY, templates);
  return newTemplate;
}

export function updateTemplate(template) {
  const templates = getTemplates();
  if (!template.id || !templates[template.id]) return saveTemplate(template);
  templates[template.id] = { ...template, updatedAt: new Date().toISOString() };
  saveToStorage(T_KEY, templates);
  return templates[template.id];
}
